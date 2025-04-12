import type { Node, Edge } from "reactflow"

// Color mapping for different categories
const categoryColors = {
  data: "bg-blue-300",
  training: "bg-yellow-300",
  efficiency: "bg-cyan-400",
  rl: "bg-purple-500",
  multimodal: "bg-green-500",
  agents: "bg-orange-500",
  embeddings: "bg-gray-500",
}

// Node definitions
export const initialNodes: Node[] = [
  // Data nodes (blue)
  {
    id: "data-scraping",
    type: "categoryNode",
    position: { x: 50, y: 430 },
    data: {
      label: "Data Scraping",
      items: ["Algo"],
      bgColor: categoryColors.data,
    },
  },
  {
    id: "language-identification",
    type: "categoryNode",
    position: { x: 180, y: 230 },
    data: {
      label: "Language Identification",
      items: ["[name]", "Link"],
      bgColor: categoryColors.data,
    },
  },
  {
    id: "anonymize-data",
    type: "categoryNode",
    position: { x: 180, y: 330 },
    data: {
      label: "Anonymize data",
      items: ["[name]", "Link"],
      bgColor: categoryColors.data,
    },
  },
  {
    id: "evaluate-data-quality",
    type: "categoryNode",
    position: { x: 180, y: 430 },
    data: {
      label: "Evaluate Data Quality",
      items: ["[name]", "Link"],
      bgColor: categoryColors.data,
    },
  },
  {
    id: "clean-data",
    type: "categoryNode",
    position: { x: 180, y: 530 },
    data: {
      label: "Clean Data",
      items: ["[name]", "Link"],
      bgColor: categoryColors.data,
    },
  },

  // Training nodes (yellow)
  {
    id: "tokenizer",
    type: "categoryNode",
    position: { x: 330, y: 330 },
    data: {
      label: "Tokenizer",
      items: ["Algo", "Link"],
      bgColor: categoryColors.training,
    },
  },
  {
    id: "pre-train-small-llm",
    type: "categoryNode",
    position: { x: 480, y: 330 },
    data: {
      label: "Pre-train small LLM",
      items: ["[name]", "Link"],
      bgColor: categoryColors.training,
    },
  },
  {
    id: "fine-tune-llm-full",
    type: "categoryNode",
    position: { x: 330, y: 430 },
    data: {
      label: "Fine-tune LLM (Full)",
      items: ["[name]", "Link"],
      bgColor: categoryColors.training,
    },
  },
  {
    id: "fine-tune-llm-lora",
    type: "categoryNode",
    position: { x: 330, y: 530 },
    data: {
      label: "Fine-Tune LLM (LoRA)",
      items: ["Noahsark", "Link"],
      bgColor: categoryColors.training,
    },
  },
  {
    id: "evolve-llm",
    type: "categoryNode",
    position: { x: 480, y: 480 },
    data: {
      label: "Evolve LLM",
      items: ["[name]", "Link"],
      bgColor: categoryColors.training,
    },
  },

  // Name tag
  {
    id: "name-tag",
    type: "categoryNode",
    position: { x: 330, y: 100 },
    data: {
      label: "Nouamane Tazi",
      bgColor: categoryColors.training,
    },
  },

  // Embeddings nodes (gray)
  {
    id: "text-embeddings",
    type: "categoryNode",
    position: { x: 650, y: 80 },
    data: {
      label: "Text Embeddings",
      items: ["Abdelhakim", "Link"],
      bgColor: categoryColors.embeddings,
    },
  },
  {
    id: "rag",
    type: "categoryNode",
    position: { x: 850, y: 80 },
    data: {
      label: "RAG",
      bgColor: categoryColors.embeddings,
    },
  },

  // Agents nodes (orange)
  {
    id: "agents",
    type: "categoryNode",
    position: { x: 650, y: 180 },
    data: {
      label: "Agents",
      items: ["Abdelhakim", "Link"],
      bgColor: categoryColors.agents,
    },
  },

  // RL nodes (purple)
  {
    id: "dpo",
    type: "categoryNode",
    position: { x: 650, y: 280 },
    data: {
      label: "DPO",
      items: ["Abdelhakim", "Link"],
      bgColor: categoryColors.rl,
    },
    draggable: false,
  },
  {
    id: "rl-name",
    type: "categoryNode",
    position: { x: 850, y: 280 },
    data: {
      label: "[name]",
      items: ["Link"],
      bgColor: categoryColors.rl,
    },
  },

  // Multimodal nodes (green)
  {
    id: "speech-text",
    type: "categoryNode",
    position: { x: 650, y: 380 },
    data: {
      label: "Speech/Text",
      items: ["[name]", "Link"],
      bgColor: categoryColors.multimodal,
    },
  },
  {
    id: "placeholder-1",
    type: "categoryNode",
    position: { x: 850, y: 380 },
    data: {
      label: "[placeholder]",
      items: ["[name]", "Link"],
      bgColor: categoryColors.multimodal,
    },
  },
  {
    id: "text-speech",
    type: "categoryNode",
    position: { x: 650, y: 460 },
    data: {
      label: "Text/Speech",
      items: ["[name]", "Link"],
      bgColor: categoryColors.multimodal,
    },
  },
  {
    id: "llm",
    type: "categoryNode",
    position: { x: 650, y: 540 },
    data: {
      label: "LLM",
      items: ["[name]", "Link"],
      bgColor: categoryColors.multimodal,
    },
  },
  {
    id: "placeholder-2",
    type: "categoryNode",
    position: { x: 850, y: 540 },
    data: {
      label: "[placeholder]",
      items: ["[name]", "Link"],
      bgColor: categoryColors.multimodal,
    },
  },
  {
    id: "image-generation",
    type: "categoryNode",
    position: { x: 650, y: 620 },
    data: {
      label: "Image generation",
      items: ["[name]", "Link"],
      bgColor: categoryColors.multimodal,
    },
  },

  // Efficiency nodes (cyan)
  {
    id: "optimize-inference",
    type: "categoryNode",
    position: { x: 1000, y: 480 },
    data: {
      label: "Optimize inference",
      items: ["[name]", "Link"],
      bgColor: categoryColors.efficiency,
    },
  },
  {
    id: "deploy-to-cloud",
    type: "categoryNode",
    position: { x: 1150, y: 480 },
    data: {
      label: "Deploy to Cloud",
      items: ["[name]", "Link"],
      bgColor: categoryColors.efficiency,
    },
  },

  // Challenge node
  {
    id: "open-challenge",
    type: "categoryNode",
    position: { x: 1250, y: 430 },
    data: {
      label: "Open challenge",
      items: ["Link"],
      bgColor: "bg-black text-white",
    },
  },

  // Medal icon
  {
    id: "medal",
    position: { x: 50, y: 330 },
    data: {
      label: "🏅",
      bgColor: "bg-transparent",
    },
  },
]

// Edge definitions
export const initialEdges: Edge[] = [
  // Data flow connections
  { id: "e-ds-ld", source: "data-scraping", target: "language-identification" },
  { id: "e-ds-ad", source: "data-scraping", target: "anonymize-data" },
  { id: "e-ds-edq", source: "data-scraping", target: "evaluate-data-quality" },
  { id: "e-ds-cd", source: "data-scraping", target: "clean-data" },

  // Training flow
  { id: "e-ad-tk", source: "language-identification", target: "tokenizer" },
  { id: "e-ad-tk", source: "anonymize-data", target: "tokenizer" },
  { id: "e-tk-ptllm", source: "tokenizer", target: "pre-train-small-llm" },
  { id: "e-edq-ftllmf", source: "evaluate-data-quality", target: "fine-tune-llm-full" },
  { id: "e-cd-ftllml", source: "clean-data", target: "fine-tune-llm-lora" },
  { id: "e-ftllmf-ellm", source: "fine-tune-llm-full", target: "evolve-llm" },
  { id: "e-ftllml-ellm", source: "fine-tune-llm-lora", target: "evolve-llm" },

  // Connections to the right side
  { id: "e-ellm-te", source: "evolve-llm", target: "text-embeddings" },
  { id: "e-ellm-ag", source: "evolve-llm", target: "agents" },
  { id: "e-ellm-dpo", source: "evolve-llm", target: "dpo" },
  { id: "e-ellm-st", source: "evolve-llm", target: "speech-text" },
  { id: "e-ellm-ts", source: "evolve-llm", target: "text-speech" },
  { id: "e-ellm-llm", source: "evolve-llm", target: "llm" },
  { id: "e-ellm-ig", source: "evolve-llm", target: "image-generation" },

  // Right side connections
  { id: "e-te-rag", source: "text-embeddings", target: "rag" },
  { id: "e-dpo-rln", source: "dpo", target: "rl-name" },
  { id: "e-st-ph1", source: "speech-text", target: "placeholder-1" },
  { id: "e-llm-ph2", source: "llm", target: "placeholder-2" },

  // Efficiency connections
  { id: "e-ph2-oi", source: "placeholder-2", target: "optimize-inference" },
  { id: "e-oi-dtc", source: "optimize-inference", target: "deploy-to-cloud" },
  { id: "e-dtc-oc", source: "deploy-to-cloud", target: "open-challenge" },
]

