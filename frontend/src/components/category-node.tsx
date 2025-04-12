"use client"

import { Handle, Position, type NodeProps } from "reactflow"

export function CategoryNode({ data, isConnectable }: NodeProps) {
  return (
    <div className={`px-2 py-2 rounded-md shadow-md ${data.bgColor} text-sm min-w-[120px] max-w-[180px]`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      <div className="font-medium">{data.label}</div>
      {data.items && (
        <ul className="list-disc pl-5 text-xs mt-1">
          {data.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </div>
  )
}

