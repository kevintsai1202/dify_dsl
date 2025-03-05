/**
 * 接收 GET 請求，根據訂單編號返回訂單資訊
 */
function doGet(e) {
  // 確認是否有提供訂單編號參數
  if (!e.parameter.orderId) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Missing parameter: orderId" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // 取得訂單編號
  var orderId = e.parameter.orderId;

  // 從試算表中查詢訂單資訊
  var orderData = getOrderData(orderId);

  // 如果找不到訂單，返回錯誤訊息
  if (!orderData) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "Order not found" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // 返回訂單資訊（JSON 格式）
  return ContentService.createTextOutput(
    JSON.stringify(orderData)
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 根據訂單編號查詢試算表中的訂單資訊
 * @param {string} orderId 訂單編號
 * @return {Object|null} 訂單資訊或 null（若找不到）
 */
function getOrderData(orderId) {
  // 取得目前的試算表與工作表
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("訂單"); // 修改為您的工作表名稱
  var data = sheet.getDataRange().getValues();

  // 第一列為欄位名稱
  var headers = data[0];

  // 遍歷資料列，查找符合的訂單編號
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] == orderId) { // 假設訂單編號在第一欄
      var order = {};
      for (var j = 0; j < headers.length; j++) {
        order[headers[j]] = data[i][j];
      }
      return order;
    }
  }

  // 若找不到訂單，返回 null
  return null;
}
