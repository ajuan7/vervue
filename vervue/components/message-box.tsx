"use client";

export function MessageBox({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <div className="border border-gray-300 rounded-lg p-8 bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
}
