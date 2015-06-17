using System;
using System.Collections.Generic;
using TypeLite;

namespace Examinator.Contract
{
    [TsClass]
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
