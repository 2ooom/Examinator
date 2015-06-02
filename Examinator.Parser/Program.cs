using System.IO;
using HtmlAgilityPack;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using Newtonsoft.Json;

namespace Examinator.Parser
{
    class Program
    {
        static void Main(string[] args)
        {
            var source = args.Length > 0? args[0] : "Source/cars.pdf";
            var output = args.Length > 1? args[1] : "cars.json";
            var doc = new HtmlDocument();
            doc.Load(source);
            var parser = new SourceParser();
            var questions = parser.Parse(doc);
            AddBorders(source, "bordered_cars.pdf");
            // Step 1. Add verticla lines

            /*var stemper = new PdfStamper(reader, new FileStream("Source/cars.pdf", FileMode.Append));
            pdf.Open();
            PdfContentByte cb = writer.DirectContent;
            cb.MoveTo(pdf.PageSize.Width / 2, pdf.PageSize.Height / 2);
            cb.LineTo(pdf.PageSize.Width / 2, pdf.PageSize.Height);
            cb.Stroke();
            cb.MoveTo(10, pdf.PageSize.Height / 2);
            cb.LineTo(pdf.PageSize.Width, pdf.PageSize.Height / 2);
            cb.Stroke();
            for (var page = 1; page <= reader.NumberOfPages; page++)
            {
                var pageObj = reader.GetPageN(page);
                var content = pageObj.Get(PdfName.CONTENT);

            }
            stemper.Close();*/
            // Step 2. Generate Xsls

            // Step 3. Parse table
            using (var stream = new StreamWriter(output, false))
            {
                var outputStr = JsonConvert.SerializeObject(questions);
                
                stream.Write(outputStr);
            }
        }

        //Working with Image
        private static void AddBorders(string input, string output)
        {
            var doc = new Document();
            var reader = new PdfReader(new FileStream(input, FileMode.Open));
            using (var writeStream = new FileStream(output, FileMode.Create))
            {
                var writer = PdfWriter.GetInstance(doc, writeStream);
                using (var stamper = new PdfStamper(reader, writeStream))
                {
                    for (var page = 1; page < reader.NumberOfPages; page ++)
                    {
                        var cb = stamper.GetOverContent(page);
                        var p = reader.GetPageN(page);
                        const int marginH = 22;
                        const int marginW = 16;
                        cb.Rectangle(marginW, marginH, doc.PageSize.Width - marginW * 2 - 7, doc.PageSize.Height - marginH * 2);
                        cb.Stroke();
                        cb.Rectangle(marginW, marginH, 68, doc.PageSize.Height - marginH * 2);
                        cb.Stroke();
                        cb.Rectangle(marginW + 68, marginH, 173, doc.PageSize.Height - marginH * 2);
                        cb.Stroke();
                    }
                    stamper.Close();
                }
                reader.Close();
                writer.Close();
            }
        }
    }
}
