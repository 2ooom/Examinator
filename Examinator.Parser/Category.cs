using System;
using System.Collections.Generic;

namespace Examinator.Parser
{
    public class Category : Paragraph
    {
        public Category()
        {
            Id = Guid.NewGuid().ToString();
            Text = string.Empty;
            Questions = new List<Question>();
        }
        public IList<Question> Questions { get; set; }
    }
}
