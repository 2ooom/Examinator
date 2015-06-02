using System.Collections.Generic;

namespace Examinator.Parser
{
    public class Category
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IList<Question> Questions { get; set; }
    }
}
