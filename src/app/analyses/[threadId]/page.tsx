import AnalysisThreadClient from "./AnalysisThreadClient";

export default function AnalysisThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  return <AnalysisThreadClient threadId={params.threadId} />;
}