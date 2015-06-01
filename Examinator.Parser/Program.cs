using System;

namespace Examinator.Parser
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 2)
            {
                Console.WriteLine("Arguments format is the following: [source] [output]");
                return;
            }
            var sourcePdf = args[0];
            var output = args[1];
        }
    }
}
