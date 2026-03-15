# 個人工作室網站開發規格書 (SPEC.md)

## 專案目標
建立一個具備動態資料管理能力的接案者個人網站。
- **核心定位**：資深資工背景 (CSIE) 開發者，專精於客製化網頁與跨平台 App (React Native/Expo) 開發。
- **目標用戶**：尋求數位轉型或產品開發的企業與創業家。

## 技術棧 (Tech Stack)
- **前端**：Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **動畫**：Framer Motion.
- **後端/資料庫**：Supabase (Database, Auth, Storage).
- **部署**：Vercel.

## 資料庫架構 (Database Schema - Supabase)
1. **projects (作品集)**:
   - id, title, description (Markdown), tech_stack (Array), cover_image_url, demo_link, github_link, category (Web/App/System).
2. **services (服務項目)**:
   - id, title, description, icon_name, base_price (optional).
3. **inquiries (諮詢紀錄)**:
   - id, customer_name, email, project_type, message, status (Pending/Contacted/Finished).

## 核心頁面與功能
- **Landing Page**: 
  - Hero Section 需強調「從設計到部署的全方位客製化解決方案」。
  - 整合 Bento Grid 佈局展示技術實力。
- **Portfolio Page**: 
  - 從 Supabase 動態讀取作品，並提供類別篩選。
  - 特別標註 React Native 與 C++ 相關專案（如：C++ 教學系統）。
- **Contact**: 
  - 串接 Supabase client 直接寫入詢價資料，並觸發 Edge Function 發送 Email 通知。