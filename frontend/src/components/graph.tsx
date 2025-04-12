"use client";

import { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Edge,
  type Connection,
  type NodeTypes,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

import { CategoryNode } from "./category-node";
import { initialNodes, initialEdges } from "@/lib/graph-data";

// Define custom node types
const nodeTypes: NodeTypes = {
  categoryNode: CategoryNode,
};

export default function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[100vh] p-6">
      <div className="flex justify-center gap-4 mt-4">
        {[
          { label: "Data", color: "bg-blue-400" },
          { label: "Training", color: "bg-yellow-300" },
          { label: "Efficiency", color: "bg-cyan-400" },
          { label: "RL", color: "bg-purple-500" },
          { label: "Multimodal", color: "bg-green-500" },
          { label: "Agents", color: "bg-orange-500" },
          { label: "Embeddings", color: "bg-gray-500" },
        ].map((category) => (
          <div key={category.label} className="flex items-center gap-2">
            <div className={`w-8 h-8 ${category.color} rounded`}></div>
            <span className="text-white">{category.label}</span>
          </div>
        ))}
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultZoom={0.8}
      >
        <Controls position={"top-left"} />
        <MiniMap position={"top-right"} />
        <Background variant={BackgroundVariant.Dots} gap={20} size={0} />
      </ReactFlow>
    </div>
  );
}
