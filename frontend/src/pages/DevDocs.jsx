import DevNav from "../components/Dev/DevNav";
import DevFooter from "../components/Dev/DevFooter";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaInfoCircle } from "react-icons/fa";

const DevDocs = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dev"); // للعودة للصفحة الرئيسية
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <DevNav />

      {/* مربع الرسالة حول إخفاء الهوية */}
      <div className="bg-gray-800 text-gray-300 p-4 rounded-lg mb-8 mx-8 mt-8 flex items-center space-x-2" dir="ltr">
        <FaInfoCircle className="text-blue-400 text-lg" />
        <p className="text-gray-300">
          يتم إخفاء هوية المستخدم للحفاظ على الخصوصية. يُرجى ملاحظة أنه يتم الحفاظ على خصوصية المستخدم حيث ستكون هوية المستخدمين مخفية.
        </p>
      </div>

      {/* القسم الأول: عرض الحالات السابقة - مجاني */}
      <section className="mb-16 mx-8">
        <div className="p-6 bg-[#2a2a2a] rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-1 text-gray-100">عرض الحالات السابقة</h2>
          <span className="text-lg text-green-400 font-semibold mb-4 inline-block">مجاني</span>
          <p className="text-gray-400 mb-4">
            يمكنك استخدام هذا الـ API للوصول إلى قائمة بالحالات السابقة لأغراض التحليل. يتم إخفاء هوية المستخدم حفاظاً على الخصوصية.
          </p>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded mb-4">
            {`axios.get("https://api.swaef.fake/v1/cases/previous")
  .then(response => {
    const previousCases = response.data;
    console.log(previousCases);
  })
  .catch(error => console.error("Error fetching previous cases:", error));`}
          </SyntaxHighlighter>
        </div>
      </section>

      {/* القسم الثاني: عرض الحالات المتقدمة - مدفوع */}
      <section className="mb-16 mx-8">
  <div className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-xl">
    <h2 className="text-3xl font-bold mb-1 text-red-500">عرض الحالات المتقدمة</h2>
    <span className="text-lg text-gray-400 font-semibold mb-4 inline-block">مدفوع</span>
    <p className="text-gray-200 mb-4">
      هذا الـ API يقدم بيانات متقدمة للحالات الطارئة لأغراض تحليلية دقيقة. يتطلب الوصول إلى هذه البيانات مفتاح API مدفوع للاستفادة من التفاصيل الكاملة.
    </p>
    <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded mb-4">
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


      {/* تعليمات استخدام المفتاح API Key */}
      <section className="mb-16 mx-8">
        <h2 className="text-2xl font-bold mb-4">كيفية استخدام مفتاح API للوصول المدفوع</h2>
        <p className="text-gray-400 mb-4">
          للوصول إلى البيانات المتقدمة، يجب تضمين مفتاح API الخاص بك في ترويسة الطلبات. يمكنك إضافته كالتالي:
        </p>
        <SyntaxHighlighter language="javascript" style={vscDarkPlus} className="rounded mb-4">
          {`axios.get("https://api.swaef.fake/v1/cases/advanced", {
  headers: {
    Authorization: "Bearer YOUR_API_KEY"
  }
})
  .then(response => console.log(response.data))
  .catch(error => console.error("Error with API Key:", error));`}
        </SyntaxHighlighter>
      </section>

      <DevFooter />
    </div>
  );
};

export default DevDocs;
