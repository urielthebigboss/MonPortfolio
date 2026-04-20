import React, { useEffect, useRef } from "react";

interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
  active: boolean;
}

export const CircuitBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<CircuitNode[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      const nodes: CircuitNode[] = [];
      const cols = Math.ceil(canvas.width / 120);
      const rows = Math.ceil(canvas.height / 120);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (Math.random() > 0.6) continue;
          nodes.push({
            x: i * 120 + Math.random() * 60,
            y: j * 120 + Math.random() * 60,
            connections: [],
            active: false,
          });
        }
      }

      // Connect nearby nodes
      nodes.forEach((node, idx) => {
        nodes.forEach((other, otherIdx) => {
          if (idx === otherIdx) return;
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 180 && node.connections.length < 3) {
            node.connections.push(otherIdx);
          }
        });
      });

      nodesRef.current = nodes;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const time = Date.now() * 0.001;
      const mouse = mouseRef.current;

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach((connIdx) => {
          const other = nodes[connIdx];

          const mouseDist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
          const opacity = mouseDist < 300 ? 0.15 : 0.04;

          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Animated pulse on connections
          if (mouseDist < 400) {
            const pulsePos = (time * 0.5 + i * 0.3) % 1;
            const px = node.x + (other.x - node.x) * pulsePos;
            const py = node.y + (other.y - node.y) * pulsePos;

            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${0.4 * (1 - mouseDist / 400)})`;
            ctx.fill();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const mouseDist = Math.hypot(node.x - mouse.x, node.y - mouse.y);
        const baseOpacity = mouseDist < 300 ? 0.3 : 0.08;

        ctx.beginPath();
        ctx.arc(node.x, node.y, mouseDist < 300 ? 4 : 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${baseOpacity})`;
        ctx.fill();

        if (mouseDist < 300) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.15})`;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
