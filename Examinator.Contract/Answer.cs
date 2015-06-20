using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
    public class Answer : Paragraph<int>
    {
        public bool? IsRight { get; set; }
    }
}
