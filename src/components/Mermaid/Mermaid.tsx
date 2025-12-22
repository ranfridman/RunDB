import mermaid from "mermaid";
import React from "react";

interface MermaidProps {
  chart?: string;
  theme?: "default" | "forest" | "dark" | "neutral" | "base";
}

export class Mermaid extends React.Component<MermaidProps> {
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate(prevProps: MermaidProps) {
    // Only re-initialize if the chart or theme actually changes
    if (prevProps.chart !== this.props.chart || prevProps.theme !== this.props.theme) {
      this.renderChart();
    }
  }

  renderChart() {
    const { theme = "dark" } = this.props;

    // Initialize mermaid with the chosen theme
    mermaid.initialize({
      startOnLoad: true,
      theme: theme,
      securityLevel: "loose",
    });

    // mermaid.contentLoaded() looks for elements with class "mermaid" 
    // and renders them.
    mermaid.contentLoaded();
  }

  render() {
    return (
      <div className="mermaid" key={this.props.chart}>
        {this.props.chart}
      </div>
    );
  }
}