interface BarPathProps {
  isTop: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

/* Rounds only the top-left/top-right corners (radius 4) and lets the top
 * segment bleed 6px past its own box so the stacked top/bottom bar
 * segments visually connect with no seam at the stack boundary. */
function getBarPath({ isTop, x, y, width, height }: BarPathProps): string {
  const radius = 4;
  const bottomExtension = isTop ? 6 : 0;
  return `M${x},${y + height + bottomExtension}
          L${x},${y + radius}
          Q${x},${y} ${x + radius},${y}
          L${x + width - radius},${y}
          Q${x + width},${y} ${x + width},${y + radius}
          L${x + width},${y + height + bottomExtension}
          Z`;
}

interface BarShapeProps {
  fill?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export function TopBar({ fill, x = 0, y = 0, width = 0, height = 0 }: BarShapeProps) {
  return (
    <path
      d={getBarPath({ isTop: true, x, y, width, height })}
      stroke="none"
      fill={fill}
    />
  );
}

export function BottomBar({ fill, x = 0, y = 0, width = 0, height = 0 }: BarShapeProps) {
  return (
    <path
      d={getBarPath({ isTop: false, x, y, width, height })}
      stroke="none"
      fill={fill}
    />
  );
}
