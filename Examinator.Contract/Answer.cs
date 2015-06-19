using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Answer : Paragraph<int>
    {
        public string QuestionId { get; set; }
        public bool IsRight { get; set; }
    }
}
