using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Answer : Paragraph
    {
        public bool? IsRight { get; set; }
    }
}
