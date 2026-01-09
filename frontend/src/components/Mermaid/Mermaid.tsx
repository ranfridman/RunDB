import mermaid from "mermaid";
import React, { createRef } from "react";

interface MermaidProps {
  chart: string;
  theme?: "default" | "forest" | "dark" | "neutral" | "base";
}

export class Mermaid extends React.Component<MermaidProps, { scale: number; x: number; y: number }> {
  private containerRef = createRef<HTMLDivElement>();
  private isDragging = false;
  private startPan = { x: 0, y: 0 };

  constructor(props: MermaidProps) {
    super(props);
    this.state = { scale: 1, x: 0, y: 0 };
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps: MermaidProps) {
    if (prevProps.chart !== this.props.chart || prevProps.theme !== this.props.theme) {
      this.renderChart();
    }
  }

  async renderChart() {
    const { theme = "dark", chart } = this.props;
    if (!this.containerRef.current || !chart) return;

    mermaid.initialize({ startOnLoad: false, theme, securityLevel: "loose" });

    const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
    try {
      const { svg } = await mermaid.render(id, chart);
      this.containerRef.current.innerHTML = svg;
    } catch (e) {
      console.error("Mermaid Render Error", e);
    }
  }

  // --- Zoom Logic ---
  handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    this.setState((prev) => ({
      scale: Math.min(Math.max(prev.scale + delta, 0.2), 5), // Limit zoom between 0.2x and 5x
    }));
  };

  // --- Pan Logic ---
  handleMouseDown = (e: React.MouseEvent) => {
    this.isDragging = true;
    this.startPan = { x: e.clientX - this.state.x, y: e.clientY - this.state.y };
  };

  handleMouseMove = (e: React.MouseEvent) => {
    if (!this.isDragging) return;
    this.setState({
      x: e.clientX - this.startPan.x,
      y: e.clientY - this.startPan.y,
    });
  };

  handleMouseUp = () => {
    this.isDragging = false;
  };

  reset = () => this.setState({ scale: 1, x: 0, y: 0 });

  render() {
    const { scale, x, y } = this.state;

    return (
      <div style={{ position: "relative", border: "1px solid #444", overflow: "hidden", background: "#1a1a1a", width: "100%", height: "100%" }}>
        {/* Simple UI Controls */}
        <div style={{ position: "absolute", zIndex: 10, padding: "10px", display: "flex", gap: "5px" }}>
          <button onClick={() => this.setState({ scale: scale + 0.2 })}>+</button>
          <button onClick={() => this.setState({ scale: Math.max(0.2, scale - 0.2) })}>-</button>
          <button onClick={this.reset}>Reset</button>
        </div>

        {/* Interaction Layer */}
        <div
          onWheel={this.handleWheel}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onMouseLeave={this.handleMouseUp}
          style={{
            width: "100%",
            height: "100%",
            cursor: this.isDragging ? "grabbing" : "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* The Actual Diagram */}
          <div
            ref={this.containerRef}
            style={{
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
              transformOrigin: "center",
              transition: this.isDragging ? "none" : "transform 0.1s ease-out",
            }}
          />
        </div>
      </div>
    );
  }
}