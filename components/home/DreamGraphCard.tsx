import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useDreams } from '../../providers/DreamContext';
import { Dream } from '../../types/dream';

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
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const CARD_WIDTH = (Dimensions.get('window').width - 32) / 2 - 6; // Account for padding
const GRAPH_HEIGHT = 140;
const NODE_RADIUS = 6;
const MAX_NODES = 15; // Limit nodes for performance and visual clarity

export default function DreamGraph() {
  const router = useRouter();
  const { dreams } = useDreams();
  const [, setIteration] = useState(0);

  // Build graph data structure
  const graphData = useMemo((): GraphData => {
    // Take the most recent dreams
    const recentDreams = dreams.slice(0, MAX_NODES);

    if (recentDreams.length === 0) {
      return { nodes: [], edges: [] };
    }

    // Initialize nodes with random positions
    const nodes: GraphNode[] = recentDreams.map((dream) => ({
      id: dream.id,
      dream,
      x: Math.random() * (CARD_WIDTH - 40) + 20,
      y: Math.random() * (GRAPH_HEIGHT - 40) + 20,
      vx: 0,
      vy: 0,
      connections: 0,
    }));

    // Find edges (connections) between dreams with common elements
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

    const ITERATIONS = 50;
    const SPRING_LENGTH = 40;
    const SPRING_STRENGTH = 0.05;
    const REPULSION_STRENGTH = 100;
    const DAMPING = 0.8;
    const CENTER_GRAVITY = 0.02;

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
          const force = displacement * SPRING_STRENGTH;
          
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        });

        // Gravity towards center
        const centerX = CARD_WIDTH / 2;
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
        node.x = Math.max(margin, Math.min(CARD_WIDTH - margin, node.x));
        node.y = Math.max(margin, Math.min(GRAPH_HEIGHT - margin, node.y));
      });

      currentIteration++;
      setIteration(currentIteration);
    }, 20);

    return () => clearInterval(interval);
  }, [graphData]);

  const totalConnections = graphData.edges.length;
  const totalNodes = graphData.nodes.length;

  const handlePress = () => {
    router.push('/dream-graph');
  };

  // Get node color based on dream type
  const getNodeColor = (dream: Dream) => {
    const typeColors: Record<string, string> = {
      lucid: '#60A5FA',      // Blue
      nightmare: '#EF4444',  // Red
      recurring: '#F59E0B',  // Amber
      prophetic: '#A78BFA',  // Purple
      healing: '#10B981',    // Green
      ordinary: '#E5E7EB',   // Gray
    };
    return typeColors[dream.type] || '#E5E7EB';
  };

  if (totalNodes === 0) {
    // Fallback when no dreams exist
    return (
      <View className="w-1/2 pr-1.5">
        <Pressable
          onPress={handlePress}
          className="flex-1 rounded-2xl p-3 items-center justify-center"
          style={{
            backgroundColor: '#8B5CF6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Text className="text-3xl font-bold text-white mb-1">0</Text>
          <Text className="text-xs font-medium text-white/90 text-center">
            Dream Network
          </Text>
          <Text className="text-xs text-white/70 text-center mt-1">
            Start logging dreams
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="w-1/2 pr-1.5">
      <Pressable
        onPress={handlePress}
        className="flex-1 rounded-2xl overflow-hidden"
        style={{
          backgroundColor: '#8B5CF6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        {/* Graph Visualization */}
        <View className="absolute inset-0">
          <Svg width={CARD_WIDTH} height={GRAPH_HEIGHT}>
            <G>
              {/* Render edges */}
              {graphData.edges.map((edge, index) => {
                const sourceNode = graphData.nodes.find(n => n.id === edge.source);
                const targetNode = graphData.nodes.find(n => n.id === edge.target);
                
                if (!sourceNode || !targetNode) return null;
                
                return (
                  <Line
                    key={`edge-${index}`}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Render nodes */}
              {graphData.nodes.map((node) => (
                <Circle
                  key={`node-${node.id}`}
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={getNodeColor(node.dream)}
                  opacity={0.9}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth={1.5}
                />
              ))}
            </G>
          </Svg>
        </View>

        {/* Stats Overlay */}
        <View className="absolute bottom-0 left-0 right-0 p-3">
          <Text className="text-3xl font-bold text-white">
            {totalConnections}
          </Text>
          <Text className="text-xs font-medium text-white/90">
            {totalConnections === 1 ? 'Connection' : 'Connections'}
          </Text>
          <Text className="text-xs text-white/70 mt-0.5">
            across {totalNodes} {totalNodes === 1 ? 'dream' : 'dreams'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

