import Image from "next/image";
import { Card } from "@/components/ui/card";
import { News } from "@/types";
import { formatDate } from "@/lib/utils";
import parse from "html-react-parser";
interface NewsDetailProps {
  news: News;
}

export default function NewsDetail({ news }: NewsDetailProps) {
  return (
    <article className="flex flex-col h-full">
      <Card className="sticky top-0 bg-background border-b border-border p-8 mb-2 z-10 rounded-none gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">{news.category}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatDate(news.createdAt)}</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground leading-tight">{news.title}</h1>
        <p className="text-xs text-muted-foreground font-medium">{news.source}</p>
      </Card>

      <div className="flex-1 overflow-y-auto">
        {news.documents.length > 0 && (
          <Card className="mb-8 overflow-hidden bg-muted relative w-fit p-0">
            <Image
              src={news.documents[0]?.public_url || "/placeholder.svg"}
              alt={news.title}
              width={800}
              height={600}
            />
          </Card>
        )}
        <div className="editor-content text-xs">{parse(news.content)}</div>
      </div>
    </article>
  );
}
