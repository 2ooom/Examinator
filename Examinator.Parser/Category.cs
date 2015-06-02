using System;
using System.Collections.Generic;

namespace Examinator.Parser
{
    public class Category : Paragraph
    {
        public Category()
        {
            Id = Guid.NewGuid().ToString();
            Questions = new List<Question>();
        }
        public IList<Question> Questions { get; set; }
    }
}
