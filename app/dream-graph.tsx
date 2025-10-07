import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { Feather } from '@expo/vector-icons';
import { useDreams } from '../providers/DreamContext';
import { useTheme } from '../providers/ThemeContext';
import { Dream } from '../types/dream';

interface GraphNode {
  id: string;
  dream: Dream;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number;
}

interface GraphEdge {
  source: string;
  target: string;
  commonTags: string[];
  strength: number;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const GRAPH_WIDTH = SCREEN_WIDTH - 32;
const GRAPH_HEIGHT = SCREEN_HEIGHT - 200;
const NODE_RADIUS = 8;
const MAX_NODES = 50; // Show more nodes on full screen

export default function DreamGraphScreen() {
  const router = useRouter();
  const { dreams } = useDreams();
  const { colors } = useTheme();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [iteration, setIteration] = useState(0);

  // Build graph data structure
  const graphData = useMemo((): GraphData => {
    const recentDreams = dreams.slice(0, MAX_NODES);

    if (recentDreams.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Initialize nodes with random positions
    const nodes: GraphNode[] = recentDreams.map((dream) => ({
      id: dream.id,
      dream,
      x: Math.random() * (GRAPH_WIDTH - 40) + 20,
      y: Math.random() * (GRAPH_HEIGHT - 40) + 20,
      vx: 0,
      vy: 0,
      connections: 0,
    }));

    // Find edges between dreams with common elements
    const edges: GraphEdge[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const commonElements: string[] = [];
        
        // Check for common tags
        if (nodes[i].dream.tags && nodes[j].dream.tags) {
          const commonTags = nodes[i].dream.tags.filter(tag =>
            nodes[j].dream.tags.includes(tag)
          );
          commonElements.push(...commonTags);
        }
        
        // Check for common characters
        if (nodes[i].dream.characters && nodes[j].dream.characters) {
          const commonChars = nodes[i].dream.characters.filter(char =>
            nodes[j].dream.characters.includes(char)
          );
          commonElements.push(...commonChars.map(c => `character: ${c}`));
        }
        
        // Check for same location
        if (nodes[i].dream.location && nodes[j].dream.location && 
            nodes[i].dream.location.toLowerCase() === nodes[j].dream.location.toLowerCase()) {
          commonElements.push(`location: ${nodes[i].dream.location}`);
        }
        
        // Check for same dream type (only for special types)
        if (nodes[i].dream.type === nodes[j].dream.type && 
            nodes[i].dream.type !== 'ordinary') {
          commonElements.push(`type: ${nodes[i].dream.type}`);
        }
        
        if (commonElements.length > 0) {
          edges.push({
            source: nodes[i].id,
            target: nodes[j].id,
            commonTags: commonElements,
            strength: commonElements.length,
          });
          nodes[i].connections++;
          nodes[j].connections++;
        }
      }
    }

    return { nodes, edges };
  }, [dreams]);

  // Force-directed layout simulation
  useEffect(() => {
    if (graphData.nodes.length === 0) return;

    const ITERATIONS = 80;
    const SPRING_LENGTH = 60;
    const SPRING_STRENGTH = 0.03;
    const REPULSION_STRENGTH = 150;
    const DAMPING = 0.85;
    const CENTER_GRAVITY = 0.015;

    let currentIteration = 0;
    const interval = setInterval(() => {
      if (currentIteration >= ITERATIONS) {
        clearInterval(interval);
        return;
      }

      graphData.nodes.forEach((node) => {
        node.vx = 0;
        node.vy = 0;

        // Repulsion between all nodes
        graphData.nodes.forEach((otherNode) => {
          if (node.id === otherNode.id) return;
          
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = REPULSION_STRENGTH / (distance * distance);
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        });

        // Spring force for connected nodes
        graphData.edges.forEach((edge) => {
          let otherNode: GraphNode | undefined;

          if (edge.source === node.id) {
            otherNode = graphData.nodes.find(n => n.id === edge.target);
          } else if (edge.target === node.id) {
            otherNode = graphData.nodes.find(n => n.id === edge.source);
          }

          if (!otherNode) return;

          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const displacement = distance - SPRING_LENGTH;
          const force = displacement * SPRING_STRENGTH * edge.strength;
          
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        });

        // Gravity towards center
        const centerX = GRAPH_WIDTH / 2;
        const centerY = GRAPH_HEIGHT / 2;
        node.vx += (centerX - node.x) * CENTER_GRAVITY;
        node.vy += (centerY - node.y) * CENTER_GRAVITY;
      });

      // Apply velocities with damping and boundary constraints
      graphData.nodes.forEach((node) => {
        node.x += node.vx * DAMPING;
        node.y += node.vy * DAMPING;

        // Keep nodes within bounds
        const margin = NODE_RADIUS + 2;
        node.x = Math.max(margin, Math.min(GRAPH_WIDTH - margin, node.x));
        node.y = Math.max(margin, Math.min(GRAPH_HEIGHT - margin, node.y));
      });

      currentIteration++;
      setIteration(currentIteration);
    }, 20);

    return () => clearInterval(interval);
  }, [graphData]);

  // Get node color based on dream type
  const getNodeColor = (dream: Dream) => {
    const typeColors: Record<string, string> = {
      lucid: '#60A5FA',
      nightmare: '#EF4444',
      recurring: '#F59E0B',
      prophetic: '#A78BFA',
      healing: '#10B981',
      ordinary: '#E5E7EB',
    };
    return typeColors[dream.type] || '#E5E7EB';
  };

  const handleNodePress = (node: GraphNode) => {
    setSelectedNode(node);
  };

  const closeDetails = () => {
    setSelectedNode(null);
  };

  const navigateToDream = (dreamId: string) => {
    router.push(`/dreams/${dreamId}`);
  };

  const totalConnections = graphData.edges.length;
  const totalNodes = graphData.nodes.length;

  if (totalNodes === 0) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderBottomColor: colors.border }}>
          <Pressable onPress={() => router.back()} className="flex-row items-center">
            <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            <Text className="ml-2 text-lg font-bold" style={{ color: colors.textPrimary }}>
              Dream Graph
            </Text>
          </Pressable>
        </View>

        {/* Empty State */}
        <View className="flex-1 items-center justify-center px-8">
          <Feather name="share-2" size={64} color={colors.textSecondary} />
          <Text className="mt-4 text-xl font-bold text-center" style={{ color: colors.textPrimary }}>
            No Dreams Yet
          </Text>
          <Text className="mt-2 text-center" style={{ color: colors.textSecondary }}>
            Start logging your dreams to see connections through common symbols, characters, and themes.
          </Text>
          <Pressable
            onPress={() => router.push('/dreams/add')}
            className="mt-6 rounded-full px-6 py-3"
            style={{ backgroundColor: colors.accent }}
          >
            <Text className="font-semibold text-white">Add Your First Dream</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderBottomColor: colors.border }}>
        <Pressable onPress={() => router.back()} className="flex-row items-center">
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
          <Text className="ml-2 text-lg font-bold" style={{ color: colors.textPrimary }}>
            Dream Graph
          </Text>
        </Pressable>
        <View className="flex-row items-center">
          <Feather name="share-2" size={20} color={colors.accent} />
          <Text className="ml-2 font-semibold" style={{ color: colors.accent }}>
            {totalConnections} connections
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Stats Bar */}
        <View className="flex-row px-4 py-4 justify-around border-b" style={{ borderBottomColor: colors.border }}>
          <View className="items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {totalNodes}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Dreams
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {totalConnections}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Connections
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {Math.round((totalConnections / totalNodes) * 10) / 10}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              Avg/Dream
            </Text>
          </View>
        </View>

        {/* Graph Visualization */}
        <View className="mx-4 my-4 rounded-2xl overflow-hidden" style={{ backgroundColor: colors.cardBackground }}>
          <View style={{ height: GRAPH_HEIGHT }}>
            <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
              <G>
                {/* Render edges */}
                {graphData.edges.map((edge, index) => {
                  const sourceNode = graphData.nodes.find(n => n.id === edge.source);
                  const targetNode = graphData.nodes.find(n => n.id === edge.target);
                  
                  if (!sourceNode || !targetNode) return null;
                  
                  const opacity = Math.min(0.6, 0.2 + (edge.strength * 0.2));
                  const strokeWidth = 1 + edge.strength * 0.5;
                  
                  return (
                    <Line
                      key={`edge-${index}`}
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={colors.textSecondary}
                      strokeWidth={strokeWidth}
                      opacity={opacity}
                    />
                  );
                })}

                {/* Render nodes */}
                {graphData.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const radius = isSelected ? NODE_RADIUS * 1.5 : NODE_RADIUS + (node.connections * 0.5);
                  
                  return (
                    <Circle
                      key={`node-${node.id}`}
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill={getNodeColor(node.dream)}
                      opacity={0.9}
                      stroke={isSelected ? colors.accent : 'rgba(255, 255, 255, 0.5)'}
                      strokeWidth={isSelected ? 3 : 2}
                      onPress={() => handleNodePress(node)}
                    />
                  );
                })}
              </G>
            </Svg>
          </View>
        </View>

        {/* Legend */}
        <View className="mx-4 mb-4">
          <Text className="mb-2 font-semibold" style={{ color: colors.textPrimary }}>
            Dream Types
          </Text>
          <View className="flex-row flex-wrap">
            {[
              { type: 'lucid', color: '#60A5FA', label: 'Lucid' },
              { type: 'nightmare', color: '#EF4444', label: 'Nightmare' },
              { type: 'recurring', color: '#F59E0B', label: 'Recurring' },
              { type: 'prophetic', color: '#A78BFA', label: 'Prophetic' },
              { type: 'healing', color: '#10B981', label: 'Healing' },
              { type: 'ordinary', color: '#E5E7EB', label: 'Ordinary' },
            ].map((item) => (
              <View key={item.type} className="flex-row items-center mr-4 mb-2">
                <View
                  className="rounded-full mr-1.5"
                  style={{ width: 12, height: 12, backgroundColor: item.color }}
                />
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Selected Node Details */}
        {selectedNode && (
          <View className="mx-4 mb-4 rounded-2xl p-4" style={{ backgroundColor: colors.cardBackground }}>
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1 mr-2">
                <Text className="text-lg font-bold mb-1" style={{ color: colors.textPrimary }}>
                  {new Date(selectedNode.dream.dateTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
                <View className="flex-row items-center">
                  <View
                    className="rounded-full mr-2"
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: getNodeColor(selectedNode.dream),
                    }}
                  />
                  <Text className="text-sm capitalize" style={{ color: colors.textSecondary }}>
                    {selectedNode.dream.type}
                  </Text>
                </View>
              </View>
              <Pressable onPress={closeDetails}>
                <Feather name="x" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <Text className="mb-3" style={{ color: colors.textPrimary }} numberOfLines={3}>
              {selectedNode.dream.description}
            </Text>

            {selectedNode.dream.tags && selectedNode.dream.tags.length > 0 && (
              <View className="mb-3">
                <Text className="text-xs font-semibold mb-1" style={{ color: colors.textSecondary }}>
                  Tags ({selectedNode.dream.tags.length})
                </Text>
                <View className="flex-row flex-wrap">
                  {selectedNode.dream.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="rounded-full px-2 py-1 mr-1.5 mb-1.5"
                      style={{ backgroundColor: colors.background }}
                    >
                      <Text className="text-xs" style={{ color: colors.textPrimary }}>
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View className="mb-3">
              <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                {selectedNode.connections} {selectedNode.connections === 1 ? 'connection' : 'connections'} to other dreams
              </Text>
            </View>

            <Pressable
              onPress={() => navigateToDream(selectedNode.id)}
              className="rounded-full py-2.5 items-center"
              style={{ backgroundColor: colors.accent }}
            >
              <Text className="font-semibold text-white">View Full Dream</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

