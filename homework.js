// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	// 1. 使用 fetch() 發送 GET 請求
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products
    // 發送 GET 請求並解析 JSON，回傳產品陣列
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
    const data = await response.json();
    return data.products;
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
    // 串接購物車 API 路徑，直接回傳解析後的完整資料物件
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
    return await response.json();
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	// 1. 加上 try-catch 處理錯誤
	// 2. 檢查 response.ok 判斷是否成功
	// 3. 成功回傳 { success: true, data: [...] }
	// 4. 失敗回傳 { success: false, error: '錯誤訊息' }
    try {
        const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
        // 檢查 response.ok (狀態碼 200-299) 以判斷請求是否真正成功
        if (!response.ok) throw new Error("取得產品失敗");
        
        const data = await response.json();
        return { success: true, data: data.products };
    } catch (error) {
        // 捕捉網路中斷或 API 回傳的錯誤
        return { success: false, error: error.message };
    }
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
    // 設定 POST 動詞並帶入符合格式的 JSON body 資料
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { productId, quantity } })
    });
    return await response.json();
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
    // 使用 PATCH 對指定項目進行部分更新
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { id: cartId, quantity } })
    });
    return await response.json();
}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	// 提示：發送 DELETE 請求到 /carts/{id}
    // 將 ID 放入路徑中並使用 DELETE 動詞移除
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`, {
        method: "DELETE"
    });
    return await response.json();
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	// 提示：發送 DELETE 請求到 /carts
    // 對購物車根路徑發送 DELETE 請求即可清空全部內容
    const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
        method: "DELETE"
    });
    return await response.json();
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
   1xx：資訊回應，代表請求已接收，正在處理中。
   2xx：成功回應，代表請求已成功被處理。
   3xx：重新導向，代表需要進一步動作以完成請求。
   4xx：用戶端錯誤，代表請求包含錯誤語法或找不到資源。
   5xx：伺服器錯誤，代表伺服器在處理請求時發生異常。

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
   GET：取得、讀取資源。
   POST：新增、建立資源。
   PATCH：部分修改現有資源。
   PUT：完整替換/更新現有資源。
   DELETE：刪除指定資源。

3. 什麼是 RESTful API？
   答：一種基於 HTTP 協定發展的軟體架構風格，核心特點是將 API 視為「資源」，透過語意明確的 URL 與 HTTP 動詞來進行操作。


*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
    API_PATH,
    BASE_URL,
    ADMIN_TOKEN,
    getProducts,
    getCart,
    getProductsSafe,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
    async function runTests() {
        console.log("=== 第六週作業測試 ===\n");
        console.log("API_PATH:", API_PATH);
        console.log("");

        if (!API_PATH) {
            console.log("請先在 .env 檔案中設定 API_PATH！");
            return;
        }

        // 任務一測試
        console.log("--- 任務一：基礎 fetch ---");
        try {
            const products = await getProducts();
            console.log(
                "getProducts:",
                products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
            );
        } catch (error) {
            console.log("getProducts 錯誤:", error.message);
        }

        try {
            const cart = await getCart();
            console.log(
                "getCart:",
                cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
            );
        } catch (error) {
            console.log("getCart 錯誤:", error.message);
        }

        try {
            const result = await getProductsSafe();
            console.log(
                "getProductsSafe:",
                result?.success ? "成功" : result?.error || "回傳 undefined",
            );
        } catch (error) {
            console.log("getProductsSafe 錯誤:", error.message);
        }

        console.log("\n=== 測試結束 ===");
        console.log("\n提示：執行 node test.js 進行完整驗證");
    }

    runTests();
}