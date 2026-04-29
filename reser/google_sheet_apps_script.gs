/*
  구글시트 연결용 Apps Script
  1) 구글시트에서 확장 프로그램 > Apps Script 열기
  2) 아래 코드 붙여넣기
  3) SHEET_ID, SHEET_NAME 수정
  4) 배포 > 새 배포 > 웹 앱
     - 실행 사용자: 나
     - 액세스 권한: 모든 사용자
  5) 배포 URL을 HTML의 SHEET_SCRIPT_URL에 넣기
*/

const SHEET_ID = "https://script.google.com/macros/s/AKfycbyZipN2GR9NzI7fzOmkvbDptuITDpxVsIIigljeCOem0UE6fcKUjLw3pR_eYwkgdCOM/exec";
const SHEET_NAME = "sheet1";

function doPost(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.category || "",
    data.time || "",
    data.message || "",
    data.agree || "",
    data.marketing || "",
    data.page || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
