import { notFound } from "next/navigation";
import { DocumentReader } from "@/components/documents/document-reader";
import { getWorkspaceDoc } from "@/lib/data/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getWorkspaceDoc(slug);
  return { title: doc ? `${doc.title} · Orbit` : "Document · Orbit" };
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = await getWorkspaceDoc(slug);
  if (!doc) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <DocumentReader doc={doc} />
    </div>
  );
}
