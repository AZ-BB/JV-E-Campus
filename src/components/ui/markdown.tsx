import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ content }: { content: string }) {
    return <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold my-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold my-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold my-1">{children}</h3>,
            p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 my-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600 my-2">
                    {children}
                </blockquote>
            ),
            table: ({ children }) => (
                <table className="border border-gray-300 my-2">{children}</table>
            ),
            th: ({ children }) => (
                <th className="border border-gray-300 px-2 py-1 font-semibold">
                    {children}
                </th>
            ),
            td: ({ children }) => (
                <td className="border border-gray-300 px-2 py-1">{children}</td>
            ),
            a: ({ children, href }) => (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    {children}
                </a>
            ),
            hr: () => (
                <hr className="my-6 border-t border-gray-400 opacity-50" />
            ),
        }}
    >{content}</ReactMarkdown>
}