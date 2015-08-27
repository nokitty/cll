using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Web;

public class VerifyCode
{
    static string[] FontItems = new string[] { "Arial",
"Helvetica",
"Geneva",
"sans-serif",
"Verdana"
};
    static Brush[] BrushItems = new Brush[] { Brushes.OliveDrab,
Brushes.ForestGreen,
Brushes.DarkCyan,
Brushes.LightSlateGray,
Brushes.RoyalBlue,
Brushes.SlateBlue,
Brushes.DarkViolet,
Brushes.MediumVioletRed,
Brushes.IndianRed,
Brushes.Firebrick,
Brushes.Chocolate,
Brushes.Peru,
Brushes.Goldenrod
};
    static string[] BrushName = new string[] { "OliveDrab",
"ForestGreen",
"DarkCyan",
"LightSlateGray",
"RoyalBlue",
"SlateBlue",
"DarkViolet",
"MediumVioletRed",
"IndianRed",
"Firebrick",
"Chocolate",
"Peru",
"Goldenrod"
};
    private static Color BackColor = Color.White;
    private static Pen BorderColor = Pens.DarkGray;
    private static int Width = 52;
    private static int Height = 21;
    private Random _random;
    private string _code;
    private int _brushNameIndex;

    public VerifyCode()
    {
        _random = new Random();
        _code = GetRandomCode();
    }

    public void SetPageNoCache(HttpResponseBase response)
    {
        response.Buffer = true;
        response.ExpiresAbsolute = System.DateTime.Now.AddSeconds(-1);
        response.Expires = 0;
        response.CacheControl = "no-cache";
        response.AppendHeader("Pragma", "No-Cache");
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 取得一个 4 位的随机码
    /// </summary>
    /// <returns></returns>
    public string GetRandomCode()
    {
        return Guid.NewGuid().ToString().Substring(0, 4);
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 随机取一个字体
    /// </summary>
    /// <returns></returns>
    private Font GetFont()
    {
        int fontIndex = _random.Next(0, FontItems.Length);
        FontStyle fontStyle = GetFontStyle(_random.Next(0, 2));
        return new Font(FontItems[fontIndex], 12, fontStyle);
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 取一个字体的样式
    /// </summary>
    /// <param name="index"></param>
    /// <returns></returns>
    private FontStyle GetFontStyle(int index)
    {
        switch (index)
        {
            case 0:
                return FontStyle.Bold;
            case 1:
                return FontStyle.Italic;
            default:
                return FontStyle.Regular;
        }
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 随机取一个笔刷
    /// </summary>
    /// <returns></returns>
    private Brush GetBrush()
    {
        int brushIndex = _random.Next(0, BrushItems.Length);
        _brushNameIndex = brushIndex;
        return BrushItems[brushIndex];
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 绘画事件
    /// </summary>
    public string Paint(System.IO.Stream stream)
    {
        using (Bitmap objBitmap = new Bitmap(Width, Height))
        {
            using (Graphics g = Graphics.FromImage(objBitmap))
            {
                Paint_Background(g);
                Paint_Text(g);
                Paint_TextStain(objBitmap);
                Paint_Border(g);
                objBitmap.Save(stream, ImageFormat.Gif);
                return _code;
            }
        }
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 绘画背景颜色
    /// </summary>
    /// <param name="g"></param>
    private void Paint_Background(Graphics g)
    {
        g.Clear(BackColor);
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 绘画边框
    /// </summary>
    /// <param name="g"></param>
    private void Paint_Border(Graphics g)
    {
        g.DrawRectangle(BorderColor, 0, 0, Width - 1, Height - 1);
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 绘画文字
    /// </summary>
    /// <param name="g"></param>
    private void Paint_Text(Graphics g)
    {
        g.DrawString(_code, GetFont(), GetBrush(), 3, 1);
    }
    /**/
    /**/
    /**/
    /// <summary>
    /// 绘画文字噪音点
    /// </summary>
    /// <param name="g"></param>
    private void Paint_TextStain(Bitmap b)
    {
        for (int n = 0; n < 30; n++)
        {
            int x = _random.Next(Width);
            int y = _random.Next(Height);
            b.SetPixel(x, y, Color.FromName(BrushName[_brushNameIndex]));
        }
    }

}