import Image from "next/image";
import { Card } from "@/components/ui/card";
import { News } from "@/types";
import { formatDate, formatText } from "@/lib/utils";
import parse from "html-react-parser";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Edit, Trash } from "lucide-react";
import { useNewsFormModal } from "@/hooks/use-base-modal-store";

interface NewsDetailProps {
  news: News;
}
export default function NewsDetail({ news }: NewsDetailProps) {
  const { hasPermission } = useAuth();
  const newsFormModal = useNewsFormModal();

  const canEditNews = hasPermission("news:edit");
  const canDeleteNews = hasPermission("news:delete");

  const handleEdit = (id: string) => {
    newsFormModal.onOpenChange(true, id);
  };

  return (
    <article className="flex flex-col h-full">
      {/* Header */}
      <Card className="sticky top-0 bg-background border-b border-border p-8 mb-2 z-10 rounded-none gap-3">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              {formatText(news.category, "upper")}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatDate(news.createdAt)}</span>
          </div>
          <div className="flex gap-1">
            <Button
              className="cursor-pointer"
              onClick={() => handleEdit(news.id)}
              variant="ghost"
              size="sm"
              title="Edit"
              disabled={!canEditNews}
              style={{ display: canEditNews ? "inline-flex" : "none" }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => {}}
              variant="ghost"
              size="sm"
              title="Edit"
              disabled={!canDeleteNews}
              style={{ display: canDeleteNews ? "inline-flex" : "none" }}
            >
              <Trash className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground leading-tight">{news.title}</h1>

        <p className="text-xs text-muted-foreground font-medium">{news.source}</p>
      </Card>

      {/* Images and Content */}
      <div className="flex-1 overflow-y-auto">
        {news.documents.length > 0 && (
          <Card className="mb-8 overflow-hidden bg-muted relative w-full p-0">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              autoHeight // <-- dynamic height based on current image
              className="w-full"
            >
              {news.documents.map((doc, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={doc.public_url || "/placeholder.svg"}
                    alt={news.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    sizes="100vw" // optional: responsive layout
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Card>
        )}

        {/* News Content */}
        <div className="editor-content text-xs">{parse(news.content)}</div>
      </div>
    </article>
  );
}
// export default function NewsDetail({ news }: NewsDetailProps) {
//   console.log("news len", news.documents.length);

//   return (
//     <article className="flex flex-col h-full">
//       <Card className="sticky top-0 bg-background border-b border-border p-8 mb-2 z-10 rounded-none gap-3">
//         <div className="flex items-center gap-3">
//           <span className="text-xs font-semibold text-primary uppercase tracking-widest">{news.category}</span>
//           <span className="text-xs text-muted-foreground">•</span>
//           <span className="text-xs text-muted-foreground">{formatDate(news.createdAt)}</span>
//         </div>
//         <h1 className="text-2xl font-bold text-foreground leading-tight">{news.title}</h1>
//         <p className="text-xs text-muted-foreground font-medium">{news.source}</p>
//       </Card>

//       <div className="flex-1 overflow-y-auto">
//         {news.documents.length > 0 && (
//           <Card className="mb-8 overflow-hidden bg-muted relative w-fit p-0">
//             <Image
//               src={news.documents[0]?.public_url || "/placeholder.svg"}
//               alt={news.title}
//               width={800}
//               height={600}
//             />
//           </Card>
//         )}
//         <div className="editor-content text-xs">{parse(news.content)}</div>
//       </div>
//     </article>
//   );
// }
