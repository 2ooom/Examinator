namespace Examinator.Parser
{
    public class Answer : Paragraph
    {
        public string QuestionId { get; set; }
        public bool IsRight { get; set; }
    }
}
