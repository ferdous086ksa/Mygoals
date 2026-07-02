/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Guarded / Lazy initializer for Google GenAI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "مفتاح واجهة برمجة تطبيقات Gemini (GEMINI_API_KEY) غير متاح حالياً. يرجى تهيئته في قائمة 'إعدادات > الأسرار' في واجهة AI Studio."
    );
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes FIRST

// API Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. Goal Plan Breakdown endpoint
app.post("/api/gemini/breakdown", async (req, res) => {
  try {
    const { title, description, category, priority, unit, targetValue } = req.body;
    if (!title) {
      return res.status(400).json({ error: "عنوان الهدف السنوي مطلوب للتقسيم الذكي" });
    }

    const ai = getGeminiClient();
    
    const prompt = `أنت خبير في إدارة الوقت وبناء الأهداف الذكية (SMART Goals).
قم بتقسيم الهدف السنوي التالي إلى خطة متكاملة تشمل أهدافاً شهرية (لعدة أشهر مناسبة)، وأهدافاً أسبوعية لكل شهر، ومهاماً يومية صغيرة قابلة للتنفيذ المباشر.

الهدف السنوي: "${title}"
الوصف: "${description || 'لا يوجد وصف'}"
التصنيف: "${category || 'تطوير الذات'}"
المستهدف: ${targetValue || 1} ${unit || 'مرة'}

يرجى إعطاء النتائج باللغة العربية حصراً وبصيغة JSON مطابقة تماماً للمواصفات المحددة.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد ذكاء اصطناعي متخصص في التخطيط وبناء الأنظمة الإنتاجية للأفراد. رد دائماً بصيغة JSON متوافقة مع المخطط المالي والعملي المطلوب، واستخدم لغة عربية فصحى ملهمة وواضحة جداً.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            annualGoal: { type: Type.STRING },
            monthlyGoals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "عنوان الهدف الشهري باللغة العربية (مثال: إنهاء قراءة كتابين)" },
                  month: { type: Type.INTEGER, description: "رقم الشهر من 1 إلى 12 (مثال: 7 لتمثيل شهر يوليو أو شهور قادمة)" },
                  targetValue: { type: Type.NUMBER, description: "القيمة المستهدفة لهذا الشهر" },
                  unit: { type: Type.STRING, description: "وحدة القياس للهدف" },
                  description: { type: Type.STRING, description: "شرح مبسط لكيفية إتمام هذا الهدف الشهري" }
                },
                required: ["title", "month", "targetValue", "unit", "description"]
              }
            },
            weeklyGoals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "عنوان الهدف الأسبوعي باللغة العربية (مثال: قراءة 150 صفحة)" },
                  monthIndex: { type: Type.INTEGER, description: "رقم الشهر الذي ينتمي له هذا الهدف الأسبوعي (من 1 إلى 12)" },
                  weekIndex: { type: Type.INTEGER, description: "رقم الأسبوع من 1 إلى 4" },
                  targetValue: { type: Type.NUMBER },
                  unit: { type: Type.STRING }
                },
                required: ["title", "monthIndex", "weekIndex", "targetValue", "unit"]
              }
            },
            dailyTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "مهمة يومية محددة وقابلة للإنجاز الفوري (مثال: قراءة 20 صفحة صباحاً)" },
                  priority: { type: Type.STRING, description: "مستوى الأولوية: high أو medium أو low" },
                  notes: { type: Type.STRING, description: "نصيحة قصيرة أو ملاحظة للتحفيز" }
                },
                required: ["title", "priority"]
              }
            }
          },
          required: ["annualGoal", "monthlyGoals", "weeklyGoals", "dailyTasks"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Gemini Breakdown Error:", err);
    res.status(500).json({ error: err.message || "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." });
  }
});

// 2. Productivity Advisor / Progress Analysis endpoint
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { annualGoals, monthlyGoals, weeklyGoals, dailyTasks, userProgress } = req.body;

    const ai = getGeminiClient();

    const summaryData = {
      userLevel: userProgress?.level || "beginner",
      points: userProgress?.points || 0,
      streak: userProgress?.streak || 0,
      activeAnnualGoalsCount: annualGoals?.filter((g: any) => g.status === 'active').length || 0,
      completedAnnualGoalsCount: annualGoals?.filter((g: any) => g.status === 'completed').length || 0,
      activeMonthlyGoalsCount: monthlyGoals?.filter((g: any) => g.status === 'active').length || 0,
      completedMonthlyGoalsCount: monthlyGoals?.filter((g: any) => g.status === 'completed').length || 0,
      totalDailyTasksCount: dailyTasks?.length || 0,
      completedDailyTasksCount: dailyTasks?.filter((t: any) => t.completed).length || 0,
    };

    const prompt = `أنت المرشد والمستشار الشخصي للمستخدم في تطبيق إدارة الأهداف الإنتاجية.
حلل إنجازات المستخدم الحالية لتقديم لوحة مراجعة إنتاجية ذكية:

البيانات الإجمالية للمستخدم:
- مستوى المستخدم الحالي: ${summaryData.userLevel} (النقاط: ${summaryData.points})
- سلسلة الالتزام المتواصل الحالية: ${summaryData.streak} أيام متتالية
- الأهداف السنوية النشطة: ${summaryData.activeAnnualGoalsCount} (المكتملة: ${summaryData.completedAnnualGoalsCount})
- الأهداف الشهرية النشطة: ${summaryData.activeMonthlyGoalsCount} (المكتملة: ${summaryData.completedMonthlyGoalsCount})
- المهام اليومية الإجمالية: ${summaryData.totalDailyTasksCount} (المكتملة: ${summaryData.completedDailyTasksCount})

الأهداف والتفاصيل:
أهداف سنوية: ${JSON.stringify(annualGoals?.map((g: any) => ({ title: g.title, progress: `${g.currentValue}/${g.targetValue} ${g.unit}` })))}
المهام اليومية المتبقية: ${JSON.stringify(dailyTasks?.filter((t: any) => !t.completed).map((t: any) => t.title))}

يرجى توليد نصائح وتوقعات مخصصة وملهمة باللغة العربية الفصحى وبصيغة JSON مطابقة تماماً للمخطط المحدد.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت مساعد ذكي مرشد للإنتاجية والالتزام الشخصي. هدفك بث العزيمة والتحفيز مع التحليل العلمي الدقيق لتقدم المستخدم وإعطاء نصائح قابلة للتنفيذ العملي المباشر.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advisorGreeting: { type: Type.STRING, description: "ترحيب محفز وتحليل عام لأدائه ومستواه الحالي بأسلوب مشجع جداً" },
            completionPredictions: { type: Type.STRING, description: "توقع ذكي ومبني على البيانات لموعد إتمام أهدافه الحالية، مع ذكر أي هدف مهدد بالتأخير" },
            productivityTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 نصائح علمية وعملية مخصصة لتحسين التزام هذا المستخدم وتطوير أدائه"
            },
            recommendedPriorities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 مهام أو أهداف يوصى بالتركيز عليها غداً لزيادة الإنتاجية"
            }
          },
          required: ["advisorGreeting", "completionPredictions", "productivityTips", "recommendedPriorities"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Gemini Advisor Error:", err);
    res.status(500).json({ error: err.message || "حدث خطأ أثناء توليد نصائح الذكاء الاصطناعي." });
  }
});

// 3. Postponed Task/Goal Analysis endpoint
app.post("/api/gemini/delay-analysis", async (req, res) => {
  try {
    const { delayedItems } = req.body;
    if (!delayedItems || delayedItems.length === 0) {
      return res.json({
        analysisText: "لا توجد أهداف متأخرة أو مهام مؤجلة مسجلة حالياً! أنت تؤدي بشكل رائع وتسير وفق الخطة المحددة بامتياز.",
        recommendations: [
          "استمر على هذا المستوى الرائع من الانضباط.",
          "كافئ نفسك على التزامك الحالي لتعزيز السلوك الإيجابي.",
          "ابدأ بالتخطيط لأهداف أكثر تحدياً للفترة القادمة."
        ]
      });
    }

    const ai = getGeminiClient();

    const prompt = `أنت خبير علم النفس السلوكي والإنتاجية الشخصية.
المهام والأهداف التالية تم تأجيلها أو تأخر إنجازها من قبل المستخدم لعدة مرات:
${JSON.stringify(delayedItems)}

حلل أسباب هذا التأجيل بشكل علمي ودود (مثل: صعوبة البدء، حجم الهدف الكبير، الخوف من الفشل، قلة الحافز، تشتت الانتباه) وقدم نصائح علمية عملية لمواجهتها وتحويل هذا التراجع إلى نجاح.
رد باللغة العربية الفصحى وبصيغة JSON مطابقة تماماً للمخطط المحدد.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "أنت طبيب ومستشار سلوكي متخصص في علاج التسويف وتطوير الإنتاجية. قدم دعماً معنوياً رائعاً وحلولاً إيجابية خالية من اللوم والتقريع.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysisText: { type: Type.STRING, description: "تحليل نفسي وسلوكي عميق وودود لأسباب تأخير هذه المهام وطريقة التفكير السلبية المتسببة بها" },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 خطوات عملية وبسيطة جداً مثل قاعدة الـ 5 دقائق أو تقسيم المهمة للبدء فوراً دون تسويف"
            }
          },
          required: ["analysisText", "recommendations"]
        }
      }
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Gemini Delay Analysis Error:", err);
    res.status(500).json({ error: err.message || "حدث خطأ أثناء توليد تحليل التأجيل." });
  }
});

// Vite Middleware for Development / static build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[أهدافي Backend] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
