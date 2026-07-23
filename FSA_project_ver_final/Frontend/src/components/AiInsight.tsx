interface AiInsightProps {
  insight: string;
  isLoading: boolean;
}

export default function AiInsight({ insight, isLoading }: AiInsightProps) {
  return (
    <section className="panel ai-panel">
      <p className="section-kicker">AI Insight</p>
      <h2>Nhận xét tài chính</h2>
      <p className="insight-copy">{isLoading ? "Đang tạo nhận xét tài chính..." : insight}</p>
    </section>
  );
}
