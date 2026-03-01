
import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";
import { formatCurrency, formatNumber, formatPercentage } from "../utils/formatters";

// This should be initialized outside the function to be reused.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert financial and sales analyst for a pharmaceutical distribution company. 
Your role is to provide clear, concise, and actionable insights based on the Key Performance Indicator (KPI) data provided.
- Analyze the data context first.
- Directly answer the user's question based on the provided data.
- Do not make up any data. If the information is not in the provided data, state that you cannot answer the question with the current data.
- Keep your answers brief and to the point. Use bullet points for lists.
- Format your responses using Markdown for better readability.`;

export const getAiInsight = async (prompt: string, appData: AppData | null): Promise<string> => {
    if (!appData) {
        return "I can't provide insights because no data has been loaded into the dashboard yet. Please upload a CSV file first.";
    }

    // Create a concise summary of the data to provide context to the AI
    // FIX: Calculate the percentage of distributors exceeding their sales limit, as 'dailySalesExceedingLimitPercent' does not exist on KpiData.
    const distributorsExceedingLimit = appData.distributorPerformance.filter(d => d.exceedsLimit).length;
    const totalDistributorsWithSalesToday = appData.distributorPerformance.length;
    const salesExceedingLimitPercent = totalDistributorsWithSalesToday > 0 ? distributorsExceedingLimit / totalDistributorsWithSalesToday : 0;

    const dataSummary = {
        keyMetrics: {
            dailySales: formatCurrency(appData.kpiData.dailyBusinessPosition),
            totalSales: formatCurrency(appData.kpiData.totalSalesAllPrincipals),
            salesExceedingLimit: formatPercentage(salesExceedingLimitPercent),
            totalInventoryValue: formatCurrency(appData.kpiData.totalInventoryInHand),
            dailyUCC: formatNumber(appData.kpiData.dailyUCC),
        },
        topPerformingCompaniesByValue: appData.kpiData.salesByValueCompanyWise.slice(0, 3),
        topPerformingDistributorsExceedingLimit: appData.distributorPerformance.filter(d => d.exceedsLimit).slice(0, 3).map(d => ({ name: d.name, sales: formatCurrency(d.sales) })),
        branchCount: appData.uniqueBranches.length
    };
    
    const context = `
    Here is a JSON summary of the current dashboard data:
    \`\`\`json
    ${JSON.stringify(dataSummary, null, 2)}
    \`\`\`
    Based on this data, answer the user's question.
    `;
    
    try {
        const fullPrompt = `${context}\n\nUser Question: "${prompt}"`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: fullPrompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `There was an issue communicating with the AI service: ${error.message}`;
        }
        return "An unexpected error occurred while fetching AI insights.";
    }
};
