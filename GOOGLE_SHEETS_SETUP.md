# Google Sheets Integration Guide

This guide explains how to automatically collect all conversion audit lead details into a Google Sheet using Google Apps Script.

---

## Step 1: Open Your Google Sheet
1. Open your shared Google Sheet: **[Convertify leads](https://docs.google.com/spreadsheets/d/1XhierH9LiyZqSnERqy_NL-xaInEh1lC5ykss1YjPGiU/edit?usp=sharing)**.

## Step 2: Open Extensions & Apps Script
1. In the menu bar of your Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any default code in the editor (`myFunction` block).

## Step 3: Paste the Script Code
Copy the code below and paste it into the editor window:

```javascript
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("website leads");
  // If the sheet doesn't exist, create it
  if (!sheet) {
    sheet = ss.insertSheet("website leads");
  }
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Auto-create headers if the sheet is completely blank
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Audit Type",
        "Name",
        "WhatsApp Number",
        "Brand Name",
        "Has Website",
        "Website URL",
        "Platform",
        "Ad Spend",
        "Problems",
        "Timeline",
        "Budget",
        "Business Type",
        "Currently Selling Online",
        "Target Audience"
      ]);
      
      // Style headers to look premium (bold, dark gray background, white text)
      var range = sheet.getRange(1, 1, 1, 15);
      range.setFontWeight("bold");
      range.setBackground("#2d3748");
      range.setFontColor("#ffffff");
      range.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    sheet.appendRow([
      new Date(),
      data.auditType || "",
      data.name || "",
      data.whatsapp || "",
      data.brand || "",
      data.hasWebsite || "",
      data.websiteUrl || "",
      data.platform || "",
      data.adSpend || "",
      (data.problems || []).join(", "),
      data.timeline || "",
      data.budget || "",
      data.businessType || "",
      data.currentlySelling || "",
      data.targetAudience || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** icon (floppy disk) or press `Ctrl+S` / `Cmd+S`.

## Step 4: Deploy as a Web App
1. Click the **Deploy** button at the top right, then select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Convertify Leads API`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial: This allows the contact form to submit data without needing users to log in).*
4. Click **Deploy**.
5. Google may ask you to "Authorize Access". Click **Authorize Access**, log in to your Google Account, click **Advanced**, and click **Go to Untitled project (unsafe)** to approve permissions.
6. Once the deployment completes, copy the **Web app URL** (starts with `https://script.google.com/macros/s/...`).

## Step 5: Connect Website to Web App URL
1. Create a `.env` file in the root of the `proto-proxima` folder (or edit existing).
2. Add the URL you copied as follows:
   ```env
   PUBLIC_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```
3. When deploying the site to Vercel, Netlify, or similar hosting environments, make sure to add `PUBLIC_GOOGLE_SHEETS_URL` to your environment variables dashboard.

---

## Failsafe: Lead Backups
To protect against any configuration or network issues, the website automatically saves copies of all submitted leads to your local browser storage under the key `convertify_leads_backup`. 

You can inspect this backup in your browser console at any time by running:
```javascript
JSON.parse(localStorage.getItem('convertify_leads_backup'))
```
