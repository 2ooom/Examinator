namespace Examinator.Parser
{
    public class Answer : Paragraph
    {
        public string AnswerId { get; set; }
        public bool IsRight { get; set; }
    }
}
