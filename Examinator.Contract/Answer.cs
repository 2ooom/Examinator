using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Answer : Paragraph
    {
        public string QuestionId { get; set; }
        public bool IsRight { get; set; }
    }
}
