export default function DictionaryEntry({ term, text }) {
  const splitText = text.split("<br>");

  return (
    <div className="bg-gray-200 rounded flex flex-col items-center justify-center mx-4">
      <div className="border border-b-black">
        <label className="text-3xl font-bold">{term}</label>
      </div>

      <div className="m-4">
        {splitText.map((line, i) => {
          return <p key={i}>{line}</p>;
        })}
      </div>
    </div>
  );
}
