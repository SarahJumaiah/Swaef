import DevNav from "../components/Dev/DevNav";
import DevFooter from "../components/Dev/DevFooter";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaInfoCircle } from "react-icons/fa";

const DevDocs = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dev"); 
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen">
      <DevNav /> <br />
      <div className="mt-20 p-4 lg:mt-28">
        <div className="bg-gray-800 text-gray-300 text-center p-4 rounded-lg mb-8 mx-4 md:mx-16 lg:mx-28 flex items-center justify-center space-x-2" dir="rtl">
          <FaInfoCircle className="text-blue-400 text-lg ml-2" />
          <p className="text-gray-300">
            يتم إخفاء هوية المستخدم للحفاظ على الخصوصية. يُرجى ملاحظة أنه يتم الحفاظ على خصوصية المستخدم حيث ستكون هوية المستخدمين مخفية.
          </p>
        </div>

        <section className="mb-16 mx-4 md:mx-8 lg:mx-28">
          <div className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg text-center flex flex-col items-center mx-auto w-full ">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 text-gray-100">عرض الحالات السابقة</h2>
            <span className="text-lg md:text-xl text-green-400 font-semibold mb-4">مجاني</span>
            <p className="text-gray-400 mb-4">
              يمكنك استخدام هذا الـ API للوصول إلى قائمة بالحالات السابقة لأغراض التحليل. يتم إخفاء هوية المستخدم حفاظاً على الخصوصية.
            </p>
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded mb-4 max-w-full w-90 mx-auto">
              {`axios.get("https://api.swaef.fake/v1/cases/previous")
  .then(response => {
    const previousCases = response.data;
    console.log(previousCases);
  })
  .catch(error => console.error("Error fetching previous cases:", error));`}
            </SyntaxHighlighter>
          </div>
        </section>

        <section className="mb-16 mx-4 md:mx-8 lg:mx-28">
          <div className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg text-center flex flex-col items-center mx-auto w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 text-white">عرض الحالات المتقدمة</h2>
            <span className="text-lg md:text-xl font-semibold mb-4 text-red-500">مدفوع</span>
            <p className="text-gray-400 mb-4">
              هذا الـ API يقدم بيانات متقدمة للحالات الطارئة لأغراض تحليلية دقيقة. يتطلب الوصول إلى هذه البيانات مفتاح API مدفوع للاستفادة من التفاصيل الكاملة.
            </p>
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded mb-4 max-w-full w-90 mx-auto">
              {`axios.get("https://api.swaef.fake/v1/cases/advanced", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY"
  }
})
  .then(response => console.log("Advanced Cases:", response.data))
  .catch(error => console.error("Error fetching advanced cases:", error));`}
            </SyntaxHighlighter>
          </div>
        </section>

        <section className="mb-16 mx-4 md:mx-8 lg:mx-28">
          <div className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg text-center flex flex-col items-center mx-auto ">
            <h2 className="text-xl md:text-2xl font-bold mb-4">كيفية استخدام مفتاح API للوصول المدفوع</h2>
            <p className="text-gray-400 mb-4">
              للوصول إلى البيانات المتقدمة، يجب تضمين مفتاح API الخاص بك في ترويسة الطلبات. يمكنك إضافته كالتالي:
            </p>
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded mb-4 max-w-full w-90 mx-auto">
              {`axios.get("https://api.swaef.fake/v1/cases/advanced", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY"
  }
})
  .then(response => console.log(response.data))
  .catch(error => console.error("Error with API Key:", error));`}
            </SyntaxHighlighter>
          </div>
        </section>
      </div>

      <DevFooter />
    </div>
  );
};

export default DevDocs;
