import Link from "next/link";

interface NoteCardProps {
  title?: string;
  content?: string;
  className?: string;
  id: string;
}
export default function NoteCard({
  title,
  content,
  className,
  id,
}: NoteCardProps) {
  return (
    <Link href={`/note/${id}`} passHref>
      <div
        className={`cursor-pointer rounded-xl bg-r-white p-6 text-r-black transition-all duration-200 hover:rounded-3xl hover:shadow-lg hover:shadow-r-black/5 dark:bg-r-darkWhite dark:text-r-darkBlack dark:hover:shadow-r-darkWhite/5 ${className}`}
      >
        {title && (
          <h1 className={`${content && "mb-2"} text-xl font-bold`}>{title}</h1>
        )}
        {content && (
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="proseClass max-h-60 text-sm line-clamp-6"
          ></div>
        )}
      </div>
    </Link>
  );
}
