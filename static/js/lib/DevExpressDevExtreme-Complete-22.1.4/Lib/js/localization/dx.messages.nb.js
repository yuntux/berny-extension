/*!
* DevExtreme (dx.messages.nb.js)
* Version: 22.1.4
* Build date: Fri Jul 22 2022
*
* Copyright (c) 2012 - 2022 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
"use strict";

! function(root, factory) {
    if ("function" === typeof define && define.amd) {
        define((function(require) {
            factory(require("devextreme/localization"))
        }))
    } else if ("object" === typeof module && module.exports) {
        factory(require("devextreme/localization"))
    } else {
        factory(DevExpress.localization)
    }
}(0, (function(localization) {
    localization.loadMessages({
        nb: {
            Yes: "Ja",
            No: "Nei",
            Cancel: "Avbryt",
            Clear: "Slett",
            Done: "Fullf\xf8rt",
            Loading: "Laster...",
            Select: "Velg...",
            Search: "S\xf8k",
            Back: "Tilbake",
            OK: "OK",
            "dxCollectionWidget-noDataText": "Ingen data \xe5 vise",
            "dxDropDownEditor-selectLabel": "Velg",
            "validation-required": "P\xe5krevd",
            "validation-required-formatted": "{0} er p\xe5krevd",
            "validation-numeric": "Verdi m\xe5 v\xe6re et tall",
            "validation-numeric-formatted": "{0} m\xe5 v\xe6re et tall",
            "validation-range": "Verdien er utenfor intervall",
            "validation-range-formatted": "{0} er utenfor intervall",
            "validation-stringLength": "Tekstverdiens lengde er ikke korrekt",
            "validation-stringLength-formatted": "Tekstlengden p\xe5 {0}\xa0 er ikke korrekt",
            "validation-custom": "Verdien er ugyldig",
            "validation-custom-formatted": "{0} er ugyldig",
            "validation-async": "Verdien er ugyldig",
            "validation-async-formatted": "{0} er ugyldig",
            "validation-compare": "Verdiene matcher ikke",
            "validation-compare-formatted": "{0} matcher ikke",
            "validation-pattern": "Verdien matcher ikke m\xf8nsteret",
            "validation-pattern-formatted": "{0} matcher ikke m\xf8nsteret",
            "validation-email": "E-post er ikke gyldig",
            "validation-email-formatted": "{0} er ugyldig",
            "validation-mask": "Verdien er ugyldig",
            "dxLookup-searchPlaceholder": "Minste antall tegn: {0}\xa0",
            "dxList-pullingDownText": "Trekk ned for \xe5 oppdatere...",
            "dxList-pulledDownText": "Slipp for \xe5 oppdatere...",
            "dxList-refreshingText": "Oppdaterer...",
            "dxList-pageLoadingText": "Laster...",
            "dxList-nextButtonText": "Mer",
            "dxList-selectAll": "Velg alle",
            "dxListEditDecorator-delete": "Slett",
            "dxListEditDecorator-more": "Mer",
            "dxScrollView-pullingDownText": "Dra ned for \xe5 oppdatere...",
            "dxScrollView-pulledDownText": " Slipp for \xe5 oppdatere...",
            "dxScrollView-refreshingText": "Oppdaterer...",
            "dxScrollView-reachBottomText": "Laster...",
            "dxDateBox-simulatedDataPickerTitleTime": "Velg tid",
            "dxDateBox-simulatedDataPickerTitleDate": "Velg dato",
            "dxDateBox-simulatedDataPickerTitleDateTime": "Velg dato og tid",
            "dxDateBox-validation-datetime": "Verdien m\xe5 v\xe6re dato eller tid",
            "dxFileUploader-selectFile": "Velg fil",
            "dxFileUploader-dropFile": "eller dropp filen her",
            "dxFileUploader-bytes": "bytes",
            "dxFileUploader-kb": "kb",
            "dxFileUploader-Mb": "Mb",
            "dxFileUploader-Gb": "Gb",
            "dxFileUploader-upload": "Last opp",
            "dxFileUploader-uploaded": "Opplastet",
            "dxFileUploader-readyToUpload": "Klar til \xe5 laste opp",
            "dxFileUploader-uploadAbortedMessage": "Opplastingen avbrutt",
            "dxFileUploader-uploadFailedMessage": "Opplastingen feilet",
            "dxFileUploader-invalidFileExtension": "Filtypen er ikke tillatt",
            "dxFileUploader-invalidMaxFileSize": "Filen er for stor",
            "dxFileUploader-invalidMinFileSize": "Filen er for liten",
            "dxRangeSlider-ariaFrom": "Fra",
            "dxRangeSlider-ariaTill": "Til",
            "dxSwitch-switchedOnText": "P\xc5",
            "dxSwitch-switchedOffText": "AV",
            "dxForm-optionalMark": "Valgfri",
            "dxForm-requiredMessage": "{0} er p\xe5krevd",
            "dxNumberBox-invalidValueMessage": "Verdien m\xe5 v\xe6re et tall",
            "dxNumberBox-noDataText": "Ingen data",
            "dxDataGrid-columnChooserTitle": "Kollonnevelger",
            "dxDataGrid-columnChooserEmptyText": "Dra kolonnen hit for \xe5 skjule den",
            "dxDataGrid-groupContinuesMessage": "Fortsetter p\xe5 neste side",
            "dxDataGrid-groupContinuedMessage": "Fortsettelse fra forrige side",
            "dxDataGrid-groupHeaderText": "Grupp\xe9r etter denne kolonnen",
            "dxDataGrid-ungroupHeaderText": "Avgrupp\xe9r",
            "dxDataGrid-ungroupAllText": "Avgrupp\xe9r alle",
            "dxDataGrid-editingEditRow": "Endre",
            "dxDataGrid-editingSaveRowChanges": "Lagre",
            "dxDataGrid-editingCancelRowChanges": "Avbryt",
            "dxDataGrid-editingDeleteRow": "Slett",
            "dxDataGrid-editingUndeleteRow": "Angre sletting",
            "dxDataGrid-editingConfirmDeleteMessage": "Er du sikker p\xe5 at du vil slette denne oppf\xf8ringen?",
            "dxDataGrid-validationCancelChanges": "Avbryt endringer",
            "dxDataGrid-groupPanelEmptyText": "Dra en kolonneoverskrift hit for \xe5 gruppere etter den kolonnen",
            "dxDataGrid-noDataText": "Ingen data",
            "dxDataGrid-searchPanelPlaceholder": "S\xf8k...",
            "dxDataGrid-filterRowShowAllText": "(Alle)",
            "dxDataGrid-filterRowResetOperationText": "Tilbakestill",
            "dxDataGrid-filterRowOperationEquals": "Er lik",
            "dxDataGrid-filterRowOperationNotEquals": "Er ikke lik",
            "dxDataGrid-filterRowOperationLess": "Mindre enn",
            "dxDataGrid-filterRowOperationLessOrEquals": "Mindre enn eller lik",
            "dxDataGrid-filterRowOperationGreater": "St\xf8rre enn ",
            "dxDataGrid-filterRowOperationGreaterOrEquals": "St\xf8rre enn eller lik",
            "dxDataGrid-filterRowOperationStartsWith": "Begynner med",
            "dxDataGrid-filterRowOperationContains": "Inneholder",
            "dxDataGrid-filterRowOperationNotContains": "Inneholder ikke",
            "dxDataGrid-filterRowOperationEndsWith": "Ender med",
            "dxDataGrid-filterRowOperationBetween": "Mellom",
            "dxDataGrid-filterRowOperationBetweenStartText": "Start",
            "dxDataGrid-filterRowOperationBetweenEndText": "Slutt",
            "dxDataGrid-applyFilterText": "Bruk filter",
            "dxDataGrid-trueText": "sant",
            "dxDataGrid-falseText": "usant",
            "dxDataGrid-sortingAscendingText": "Sort\xe9r stigende",
            "dxDataGrid-sortingDescendingText": "Sort\xe9r fallende",
            "dxDataGrid-sortingClearText": "Nullstill sortering",
            "dxDataGrid-editingSaveAllChanges": "Lagre endringer",
            "dxDataGrid-editingCancelAllChanges": "Forkast endringer",
            "dxDataGrid-editingAddRow": "Legg til rad",
            "dxDataGrid-summaryMin": "Min: {0}\xa0",
            "dxDataGrid-summaryMinOtherColumn": "Min av {1} er {0}",
            "dxDataGrid-summaryMax": "Maks: {0}",
            "dxDataGrid-summaryMaxOtherColumn": "Maks av {1} er {0}",
            "dxDataGrid-summaryAvg": "Gj.snitt: {0}",
            "dxDataGrid-summaryAvgOtherColumn": "Gj.snitt av {1} er {0}",
            "dxDataGrid-summarySum": "Sum: {0}",
            "dxDataGrid-summarySumOtherColumn": "Summen av {1} er {0}",
            "dxDataGrid-summaryCount": "Telling: {0}",
            "dxDataGrid-columnFixingFix": "L\xe5s",
            "dxDataGrid-columnFixingUnfix": "L\xe5s opp",
            "dxDataGrid-columnFixingLeftPosition": "Til venstre",
            "dxDataGrid-columnFixingRightPosition": "Til h\xf8yre",
            "dxDataGrid-exportTo": "Eksport\xe9r",
            "dxDataGrid-exportToExcel": "Eksport\xe9r til Excel fil",
            "dxDataGrid-exporting": "Eksport\xe9rer...",
            "dxDataGrid-excelFormat": "Excel fil",
            "dxDataGrid-selectedRows": "Valgte rader",
            "dxDataGrid-exportSelectedRows": "Eksport\xe9r valgte rader",
            "dxDataGrid-exportAll": "Eksport\xe9r all data",
            "dxDataGrid-headerFilterEmptyValue": "(Tom)",
            "dxDataGrid-headerFilterOK": "OK",
            "dxDataGrid-headerFilterCancel": "Avbryt",
            "dxDataGrid-ariaAdaptiveCollapse": "TODO",
            "dxDataGrid-ariaAdaptiveExpand": "TODO",
            "dxDataGrid-ariaColumn": "Kolonne",
            "dxDataGrid-ariaValue": "Verdi",
            "dxDataGrid-ariaFilterCell": "Filtr\xe9r celle",
            "dxDataGrid-ariaCollapse": "Skjul",
            "dxDataGrid-ariaExpand": "Utvid",
            "dxDataGrid-ariaDataGrid": "Data rutenett",
            "dxDataGrid-ariaSearchInGrid": "S\xf8k i data rutenett",
            "dxDataGrid-ariaSelectAll": "Velg alle",
            "dxDataGrid-ariaSelectRow": "Velg rad",
            "dxDataGrid-ariaToolbar": "TODO",
            "dxDataGrid-filterBuilderPopupTitle": "Filterbygger",
            "dxDataGrid-filterPanelCreateFilter": "Velg filter",
            "dxDataGrid-filterPanelClearFilter": "Slett",
            "dxDataGrid-filterPanelFilterEnabledHint": "Aktiv\xe9r filter",
            "dxTreeList-ariaTreeList": "Treliste",
            "dxTreeList-ariaSearchInGrid": "TODO",
            "dxTreeList-ariaToolbar": "TODO",
            "dxTreeList-editingAddRowToNode": "Legg til",
            "dxPager-infoText": "Side {0} av {1} ({2} punkter)",
            "dxPager-pagesCountText": "av",
            "dxPager-pageSizesAllText": "Alle",
            "dxPivotGrid-grandTotal": "Totalsum",
            "dxPivotGrid-total": "{0} Totalt",
            "dxPivotGrid-fieldChooserTitle": "Feltvelger",
            "dxPivotGrid-showFieldChooser": "Vis feltvelger",
            "dxPivotGrid-expandAll": "Utvid alle",
            "dxPivotGrid-collapseAll": "Skjul alle",
            "dxPivotGrid-sortColumnBySummary": 'Sort\xe9r "{0}" p\xe5 denne kolonnen',
            "dxPivotGrid-sortRowBySummary": 'Sort\xe9r "{0}" p\xe5 denne raden',
            "dxPivotGrid-removeAllSorting": "Fjern all sortering",
            "dxPivotGrid-dataNotAvailable": "N/A",
            "dxPivotGrid-rowFields": "Radfelter",
            "dxPivotGrid-columnFields": "Kollonnerfelter",
            "dxPivotGrid-dataFields": "Datafelter",
            "dxPivotGrid-filterFields": "Filterfelter",
            "dxPivotGrid-allFields": "Alle felter",
            "dxPivotGrid-columnFieldArea": "Slipp kolonnefelter her",
            "dxPivotGrid-dataFieldArea": "Slipp datafelter her",
            "dxPivotGrid-rowFieldArea": "Slipp radfelter her",
            "dxPivotGrid-filterFieldArea": "Slipp filterfelter her",
            "dxScheduler-editorLabelTitle": "Emne",
            "dxScheduler-editorLabelStartDate": "Startdato",
            "dxScheduler-editorLabelEndDate": "Sluttdato",
            "dxScheduler-editorLabelDescription": "Beskrivelse",
            "dxScheduler-editorLabelRecurrence": "Gjenta",
            "dxScheduler-openAppointment": "\xc5pen avtale",
            "dxScheduler-recurrenceNever": "Aldri",
            "dxScheduler-recurrenceMinutely": "Hvert minutt",
            "dxScheduler-recurrenceHourly": "Per time",
            "dxScheduler-recurrenceDaily": "Daglig",
            "dxScheduler-recurrenceWeekly": "Ukentlig",
            "dxScheduler-recurrenceMonthly": "M\xe5nedlig",
            "dxScheduler-recurrenceYearly": "\xc5rlig",
            "dxScheduler-recurrenceRepeatEvery": "Gjenta hver",
            "dxScheduler-recurrenceRepeatOn": "Gjenta p\xe5",
            "dxScheduler-recurrenceEnd": "Avslutt gjentakelse",
            "dxScheduler-recurrenceAfter": "Etter",
            "dxScheduler-recurrenceOn": "P\xe5",
            "dxScheduler-recurrenceRepeatMinutely": "minutt(er)",
            "dxScheduler-recurrenceRepeatHourly": "time(r)",
            "dxScheduler-recurrenceRepeatDaily": "dag(er)",
            "dxScheduler-recurrenceRepeatWeekly": "uke(r)",
            "dxScheduler-recurrenceRepeatMonthly": "m\xe5ned(er)",
            "dxScheduler-recurrenceRepeatYearly": "\xe5r",
            "dxScheduler-switcherDay": "Dag",
            "dxScheduler-switcherWeek": "Uke",
            "dxScheduler-switcherWorkWeek": "Arbeidsuke",
            "dxScheduler-switcherMonth": "M\xe5ned",
            "dxScheduler-switcherAgenda": "Agenda",
            "dxScheduler-switcherTimelineDay": "Tidslinje dag",
            "dxScheduler-switcherTimelineWeek": "Tidslinje uke",
            "dxScheduler-switcherTimelineWorkWeek": "Tidslinje arbeidsuke",
            "dxScheduler-switcherTimelineMonth": "Tidslinje m\xe5ned",
            "dxScheduler-recurrenceRepeatOnDate": "p\xe5 dato",
            "dxScheduler-recurrenceRepeatCount": "tilfelle(r)",
            "dxScheduler-allDay": "Hele dagen",
            "dxScheduler-confirmRecurrenceEditMessage": "Vil du kun endre denne avtalen eller hele serien?",
            "dxScheduler-confirmRecurrenceDeleteMessage": "Vil du kun slette denne avtalen eller hele serien? ",
            "dxScheduler-confirmRecurrenceEditSeries": "Endre serie",
            "dxScheduler-confirmRecurrenceDeleteSeries": "Slette serie",
            "dxScheduler-confirmRecurrenceEditOccurrence": "Endre avtale",
            "dxScheduler-confirmRecurrenceDeleteOccurrence": "Slette avtale",
            "dxScheduler-noTimezoneTitle": "Ingen tidssone",
            "dxScheduler-moreAppointments": "{0} mer",
            "dxCalendar-todayButtonText": "I dag",
            "dxCalendar-ariaWidgetName": "Kalender",
            "dxColorView-ariaRed": "R\xf8d",
            "dxColorView-ariaGreen": "Gr\xf8nn",
            "dxColorView-ariaBlue": "Bl\xe5",
            "dxColorView-ariaAlpha": "\xc5penhet",
            "dxColorView-ariaHex": "Fargekode",
            "dxTagBox-selected": "{0} valgt",
            "dxTagBox-allSelected": "Alle valgt ({0})",
            "dxTagBox-moreSelected": "{0} flere",
            "vizExport-printingButtonText": "Skriv ut",
            "vizExport-titleMenuText": "Eksporterer/Skriver ut",
            "vizExport-exportButtonText": "{0} filer",
            "dxFilterBuilder-and": "Og",
            "dxFilterBuilder-or": "Eller",
            "dxFilterBuilder-notAnd": "Ikke og",
            "dxFilterBuilder-notOr": "Ikke eller",
            "dxFilterBuilder-addCondition": "Legg til betingelse",
            "dxFilterBuilder-addGroup": "Legg til gruppe",
            "dxFilterBuilder-enterValueText": "TODO",
            "dxFilterBuilder-filterOperationEquals": "Er lik",
            "dxFilterBuilder-filterOperationNotEquals": "Er ikke lik",
            "dxFilterBuilder-filterOperationLess": "Er mindre enn",
            "dxFilterBuilder-filterOperationLessOrEquals": "Er mindre eller lik",
            "dxFilterBuilder-filterOperationGreater": "Er st\xf8rre enn",
            "dxFilterBuilder-filterOperationGreaterOrEquals": "Er st\xf8rre enn eller lik",
            "dxFilterBuilder-filterOperationStartsWith": "Begynner med",
            "dxFilterBuilder-filterOperationContains": "Inneholder",
            "dxFilterBuilder-filterOperationNotContains": "Inneholder ikke",
            "dxFilterBuilder-filterOperationEndsWith": "Slutter med",
            "dxFilterBuilder-filterOperationIsBlank": "Er tom",
            "dxFilterBuilder-filterOperationIsNotBlank": "Er ikke tom",
            "dxFilterBuilder-filterOperationBetween": "Er mellom",
            "dxFilterBuilder-filterOperationAnyOf": "Er noen av",
            "dxFilterBuilder-filterOperationNoneOf": "Er ingen av",
            "dxHtmlEditor-dialogColorCaption": "Skift fontfarge",
            "dxHtmlEditor-dialogBackgroundCaption": "Skift bakgrunnsfarge",
            "dxHtmlEditor-dialogLinkCaption": "Legg til link",
            "dxHtmlEditor-dialogLinkUrlField": "URL",
            "dxHtmlEditor-dialogLinkTextField": "Tekst",
            "dxHtmlEditor-dialogLinkTargetField": "\xc5pne link i nytt vindu",
            "dxHtmlEditor-dialogImageCaption": "Legg til bilde",
            "dxHtmlEditor-dialogImageUrlField": "URL",
            "dxHtmlEditor-dialogImageAltField": "Alternativ tekst",
            "dxHtmlEditor-dialogImageWidthField": "Bredde (px)",
            "dxHtmlEditor-dialogImageHeightField": "H\xf8yde (px)",
            "dxHtmlEditor-dialogInsertTableRowsField": "Rad",
            "dxHtmlEditor-dialogInsertTableColumnsField": "Kolonne",
            "dxHtmlEditor-dialogInsertTableCaption": "Sett inn tabell",
            "dxHtmlEditor-dialogUpdateImageCaption": "TODO",
            "dxHtmlEditor-dialogImageUpdateButton": "TODO",
            "dxHtmlEditor-dialogImageAddButton": "TODO",
            "dxHtmlEditor-dialogImageSpecifyUrl": "TODO",
            "dxHtmlEditor-dialogImageSelectFile": "TODO",
            "dxHtmlEditor-dialogImageKeepAspectRatio": "TODO",
            "dxHtmlEditor-dialogImageEncodeToBase64": "TODO",
            "dxHtmlEditor-heading": "Overskrift",
            "dxHtmlEditor-normalText": "Normal tekst",
            "dxHtmlEditor-background": "TODO",
            "dxHtmlEditor-bold": "TODO",
            "dxHtmlEditor-color": "TODO",
            "dxHtmlEditor-font": "TODO",
            "dxHtmlEditor-italic": "TODO",
            "dxHtmlEditor-link": "TODO",
            "dxHtmlEditor-image": "TODO",
            "dxHtmlEditor-size": "TODO",
            "dxHtmlEditor-strike": "TODO",
            "dxHtmlEditor-subscript": "TODO",
            "dxHtmlEditor-superscript": "TODO",
            "dxHtmlEditor-underline": "TODO",
            "dxHtmlEditor-blockquote": "TODO",
            "dxHtmlEditor-header": "TODO",
            "dxHtmlEditor-increaseIndent": "TODO",
            "dxHtmlEditor-decreaseIndent": "TODO",
            "dxHtmlEditor-orderedList": "TODO",
            "dxHtmlEditor-bulletList": "TODO",
            "dxHtmlEditor-alignLeft": "TODO",
            "dxHtmlEditor-alignCenter": "TODO",
            "dxHtmlEditor-alignRight": " TODO",
            "dxHtmlEditor-alignJustify": "TODO",
            "dxHtmlEditor-codeBlock": "TODO",
            "dxHtmlEditor-variable": "TODO",
            "dxHtmlEditor-undo": "TODO",
            "dxHtmlEditor-redo": "TODO",
            "dxHtmlEditor-clear": "TODO",
            "dxHtmlEditor-insertTable": "TODO",
            "dxHtmlEditor-insertHeaderRow": "TODO",
            "dxHtmlEditor-insertRowAbove": "TODO",
            "dxHtmlEditor-insertRowBelow": "TODO",
            "dxHtmlEditor-insertColumnLeft": "TODO",
            "dxHtmlEditor-insertColumnRight": "TODO",
            "dxHtmlEditor-deleteColumn": "TODO",
            "dxHtmlEditor-deleteRow": "TODO",
            "dxHtmlEditor-deleteTable": "TODO",
            "dxHtmlEditor-cellProperties": "TODO",
            "dxHtmlEditor-tableProperties": "TODO",
            "dxHtmlEditor-insert": "TODO",
            "dxHtmlEditor-delete": "TODO",
            "dxHtmlEditor-border": "TODO",
            "dxHtmlEditor-style": "TODO",
            "dxHtmlEditor-width": "TODO",
            "dxHtmlEditor-height": "TODO",
            "dxHtmlEditor-borderColor": "TODO",
            "dxHtmlEditor-tableBackground": "TODO",
            "dxHtmlEditor-dimensions": "TODO",
            "dxHtmlEditor-alignment": "TODO",
            "dxHtmlEditor-horizontal": "TODO",
            "dxHtmlEditor-vertical": "TODO",
            "dxHtmlEditor-paddingVertical": "TODO",
            "dxHtmlEditor-paddingHorizontal": "TODO",
            "dxHtmlEditor-pixels": "TODO",
            "dxHtmlEditor-list": "TODO",
            "dxHtmlEditor-ordered": "TODO",
            "dxHtmlEditor-bullet": "TODO",
            "dxHtmlEditor-align": "TODO",
            "dxHtmlEditor-center": "TODO",
            "dxHtmlEditor-left": "TODO",
            "dxHtmlEditor-right": "TODO",
            "dxHtmlEditor-indent": "TODO",
            "dxHtmlEditor-justify": "TODO",
            "dxFileManager-newDirectoryName": "Katalog uten navn",
            "dxFileManager-rootDirectoryName": "Filer",
            "dxFileManager-errorNoAccess": "Ingen tilgang. Operasjonen kunne ikke fullf\xf8res.",
            "dxFileManager-errorDirectoryExistsFormat": "Katalog '{0}' eksisterer allerede.",
            "dxFileManager-errorFileExistsFormat": "Fil '{0}' eksisterer allerede.",
            "dxFileManager-errorFileNotFoundFormat": "Fil '{0}' ble ikke funnet. ",
            "dxFileManager-errorDirectoryNotFoundFormat": "Katalogen '{0}' ble ikke funnet.",
            "dxFileManager-errorWrongFileExtension": "Filtypen er ikke tillatt.",
            "dxFileManager-errorMaxFileSizeExceeded": "Filst\xf8rrelsen overg\xe5r maksimal tillatt st\xf8rrelse.",
            "dxFileManager-errorInvalidSymbols": "Dette navnet inneholder ugyldige tegn. ",
            "dxFileManager-errorDefault": "Uspesifisert feil.",
            "dxFileManager-errorDirectoryOpenFailed": "Katalogen kan ikke \xe5pnes",
            "dxFileManager-commandCreate": "Ny katalog",
            "dxFileManager-commandRename": "Endre navn",
            "dxFileManager-commandMove": "Flytt til",
            "dxFileManager-commandCopy": "Kopi\xe9r til",
            "dxFileManager-commandDelete": "Slett",
            "dxFileManager-commandDownload": "Last ned",
            "dxFileManager-commandUpload": "Last opp filer",
            "dxFileManager-commandRefresh": "Oppdat\xe9r",
            "dxFileManager-commandThumbnails": "Miniatyrbildevisning",
            "dxFileManager-commandDetails": "Detailvisning",
            "dxFileManager-commandClearSelection": "Frigj\xf8r valg",
            "dxFileManager-commandShowNavPane": "Veksle navigasjonsrute",
            "dxFileManager-dialogDirectoryChooserMoveTitle": "Flytt til",
            "dxFileManager-dialogDirectoryChooserMoveButtonText": "Flytt",
            "dxFileManager-dialogDirectoryChooserCopyTitle": "Kopier til",
            "dxFileManager-dialogDirectoryChooserCopyButtonText": "Kopier",
            "dxFileManager-dialogRenameItemTitle": "Endre navn",
            "dxFileManager-dialogRenameItemButtonText": "Lagre",
            "dxFileManager-dialogCreateDirectoryTitle": "Ny katalog",
            "dxFileManager-dialogCreateDirectoryButtonText": "Opprett",
            "dxFileManager-dialogDeleteItemTitle": "Slett",
            "dxFileManager-dialogDeleteItemButtonText": "Slett",
            "dxFileManager-dialogDeleteItemSingleItemConfirmation": "Er du sikker p\xe5 at du slette {0}?",
            "dxFileManager-dialogDeleteItemMultipleItemsConfirmation": "Er du sikker p\xe5 at du slette {0} elementer?",
            "dxFileManager-dialogButtonCancel": "Avbryt",
            "dxFileManager-editingCreateSingleItemProcessingMessage": "Oppretter en mappe inne i {0}",
            "dxFileManager-editingCreateSingleItemSuccessMessage": "Opprettet en mappe inne i {0}",
            "dxFileManager-editingCreateSingleItemErrorMessage": "Katalog ble ikke opprettet",
            "dxFileManager-editingCreateCommonErrorMessage": "Katalog ble ikke opprettet",
            "dxFileManager-editingRenameSingleItemProcessingMessage": "Endrer navn p\xe5 et element inne i {0}",
            "dxFileManager-editingRenameSingleItemSuccessMessage": "Endret navn p\xe5 et element inne i {0}",
            "dxFileManager-editingRenameSingleItemErrorMessage": "Navneendring p\xe5 p\xe5 element ble ikke utf\xf8rt",
            "dxFileManager-editingRenameCommonErrorMessage": "Navneendring p\xe5 element ble ikke utf\xf8rt",
            "dxFileManager-editingDeleteSingleItemProcessingMessage": "Sletter et element fra {0}",
            "dxFileManager-editingDeleteMultipleItemsProcessingMessage": "Sletter {0} elementer fra {1}",
            "dxFileManager-editingDeleteSingleItemSuccessMessage": "Slettet et element fra {0}",
            "dxFileManager-editingDeleteMultipleItemsSuccessMessage": "Slettet {0} elementer fra {1}",
            "dxFileManager-editingDeleteSingleItemErrorMessage": "Element ble ikke slettet",
            "dxFileManager-editingDeleteMultipleItemsErrorMessage": "{0} elementer ble ikke slettet",
            "dxFileManager-editingDeleteCommonErrorMessage": "Noen elementer ble ikke slettet",
            "dxFileManager-editingMoveSingleItemProcessingMessage": "Flytter et element til {0}",
            "dxFileManager-editingMoveMultipleItemsProcessingMessage": "Flytter {0} elementer til {1}",
            "dxFileManager-editingMoveSingleItemSuccessMessage": "Flyttet et element til {0}",
            "dxFileManager-editingMoveMultipleItemsSuccessMessage": "Flyttet {0} elementer til {1}",
            "dxFileManager-editingMoveSingleItemErrorMessage": "Element ble ikke flyttet",
            "dxFileManager-editingMoveMultipleItemsErrorMessage": "{0} elementer ble ikke flyttet",
            "dxFileManager-editingMoveCommonErrorMessage": "Noen elementer ble ikke flyttet",
            "dxFileManager-editingCopySingleItemProcessingMessage": "Kopierer et element til {0}",
            "dxFileManager-editingCopyMultipleItemsProcessingMessage": "Kopierer {0} elementer til {1}",
            "dxFileManager-editingCopySingleItemSuccessMessage": "Kopierte et element til {0}",
            "dxFileManager-editingCopyMultipleItemsSuccessMessage": "Kopierte {0} elementer til {1}",
            "dxFileManager-editingCopySingleItemErrorMessage": "Elementet ble ikke kopiert",
            "dxFileManager-editingCopyMultipleItemsErrorMessage": "{0} elementer ble ikke kopiert",
            "dxFileManager-editingCopyCommonErrorMessage": "Noen elementer ble ikke kopiert",
            "dxFileManager-editingUploadSingleItemProcessingMessage": "Laster opp et element til {0}",
            "dxFileManager-editingUploadMultipleItemsProcessingMessage": "Laster opp {0} elementer til {1}",
            "dxFileManager-editingUploadSingleItemSuccessMessage": "Lastet opp et element til {0}",
            "dxFileManager-editingUploadMultipleItemsSuccessMessage": "Lastet opp {0} elementer til {1}",
            "dxFileManager-editingUploadSingleItemErrorMessage": "Elementet ble ikke lastet opp",
            "dxFileManager-editingUploadMultipleItemsErrorMessage": "{0} elementer ble ikke lastet opp",
            "dxFileManager-editingUploadCanceledMessage": "Avbrutt",
            "dxFileManager-listDetailsColumnCaptionName": "Navn",
            "dxFileManager-listDetailsColumnCaptionDateModified": "Dato endret",
            "dxFileManager-listDetailsColumnCaptionFileSize": "Filst\xf8rrelse",
            "dxFileManager-listThumbnailsTooltipTextSize": "St\xf8rrelse",
            "dxFileManager-listThumbnailsTooltipTextDateModified": "Dato endret",
            "dxFileManager-notificationProgressPanelTitle": "Fremdrift",
            "dxFileManager-notificationProgressPanelEmptyListText": "Ingen operasjoner",
            "dxFileManager-notificationProgressPanelOperationCanceled": "Avbrutt",
            "dxDiagram-categoryGeneral": "Generell",
            "dxDiagram-categoryFlowchart": "Flytskjema",
            "dxDiagram-categoryOrgChart": "Org. kart",
            "dxDiagram-categoryContainers": "Beholdere",
            "dxDiagram-categoryCustom": "Tilpasset",
            "dxDiagram-commandExportToSvg": "Eksport\xe9r til SVG",
            "dxDiagram-commandExportToPng": "Eksport\xe9r til PNG",
            "dxDiagram-commandExportToJpg": "Eksport\xe9r til JPEG",
            "dxDiagram-commandUndo": "Angre",
            "dxDiagram-commandRedo": "Gj\xf8r om",
            "dxDiagram-commandFontName": "Fontnavn",
            "dxDiagram-commandFontSize": "Fontst\xf8rrelse",
            "dxDiagram-commandBold": "Fet",
            "dxDiagram-commandItalic": "Kursiv",
            "dxDiagram-commandUnderline": "Understrek",
            "dxDiagram-commandTextColor": "Fontfarge",
            "dxDiagram-commandLineColor": "Linjefarge",
            "dxDiagram-commandLineWidth": "Linjebredde",
            "dxDiagram-commandLineStyle": "Linjestil",
            "dxDiagram-commandLineStyleSolid": "Heltrukket",
            "dxDiagram-commandLineStyleDotted": "Prikket",
            "dxDiagram-commandLineStyleDashed": "Stiplet",
            "dxDiagram-commandFillColor": "Fyllfarge",
            "dxDiagram-commandAlignLeft": "Venstrejust\xe9r",
            "dxDiagram-commandAlignCenter": "Sentr\xe9r",
            "dxDiagram-commandAlignRight": "H\xf8yrejust\xe9r",
            "dxDiagram-commandConnectorLineType": "Tilkoblingslinjetype",
            "dxDiagram-commandConnectorLineStraight": "Rett",
            "dxDiagram-commandConnectorLineOrthogonal": "Ortogonal",
            "dxDiagram-commandConnectorLineStart": "Tilkoblingslinje start",
            "dxDiagram-commandConnectorLineEnd": "Tilkoblingslinje slutt",
            "dxDiagram-commandConnectorLineNone": "Ingen",
            "dxDiagram-commandConnectorLineArrow": "Pil",
            "dxDiagram-commandFullscreen": "Fullskjerm",
            "dxDiagram-commandUnits": "Enheter",
            "dxDiagram-commandPageSize": "Sidest\xf8rrelse",
            "dxDiagram-commandPageOrientation": "Sideretning",
            "dxDiagram-commandPageOrientationLandscape": "Landskap",
            "dxDiagram-commandPageOrientationPortrait": "Portrett",
            "dxDiagram-commandPageColor": "Sidefarge",
            "dxDiagram-commandShowGrid": "Vis rutenett",
            "dxDiagram-commandSnapToGrid": "Fest til rutenett",
            "dxDiagram-commandGridSize": "Rutenettst\xf8rrelse",
            "dxDiagram-commandZoomLevel": "Zoomniv\xe5",
            "dxDiagram-commandAutoZoom": "Autozoom",
            "dxDiagram-commandFitToContent": "Tilpass til innhold",
            "dxDiagram-commandFitToWidth": "Tilpass til bredde",
            "dxDiagram-commandAutoZoomByContent": "Autozoom til innhold",
            "dxDiagram-commandAutoZoomByWidth": "Autozoom til bredde",
            "dxDiagram-commandSimpleView": "Enkel visning",
            "dxDiagram-commandCut": "Klipp",
            "dxDiagram-commandCopy": "Kopi\xe9r",
            "dxDiagram-commandPaste": "Lim inn",
            "dxDiagram-commandSelectAll": "Velg alle",
            "dxDiagram-commandDelete": "Slett",
            "dxDiagram-commandBringToFront": "Flytt til front",
            "dxDiagram-commandSendToBack": "Flytt til bak",
            "dxDiagram-commandLock": "L\xe5s",
            "dxDiagram-commandUnlock": "L\xe5s opp",
            "dxDiagram-commandInsertShapeImage": "Sett inn bilde...",
            "dxDiagram-commandEditShapeImage": "Endre bilde...",
            "dxDiagram-commandDeleteShapeImage": "Slett bilde",
            "dxDiagram-commandLayoutLeftToRight": "Venstre-til-h\xf8yre",
            "dxDiagram-commandLayoutRightToLeft": "H\xf8yre-til-venstre",
            "dxDiagram-commandLayoutTopToBottom": "Topp-til-bunn",
            "dxDiagram-commandLayoutBottomToTop": "Bunn-til-topp",
            "dxDiagram-unitIn": "in",
            "dxDiagram-unitCm": "cm",
            "dxDiagram-unitPx": "px",
            "dxDiagram-dialogButtonOK": "OK",
            "dxDiagram-dialogButtonCancel": "Avbryt",
            "dxDiagram-dialogInsertShapeImageTitle": "Sett inn bilde",
            "dxDiagram-dialogEditShapeImageTitle": "Endre bilde",
            "dxDiagram-dialogEditShapeImageSelectButton": "Velg bilde",
            "dxDiagram-dialogEditShapeImageLabelText": "eller slipp filen her",
            "dxDiagram-uiExport": "Eksport\xe9r",
            "dxDiagram-uiProperties": "Egenskaper",
            "dxDiagram-uiSettings": "Innstillinger",
            "dxDiagram-uiShowToolbox": "Vis verkt\xf8ykasse",
            "dxDiagram-uiSearch": "S\xf8k",
            "dxDiagram-uiStyle": "Style",
            "dxDiagram-uiLayout": "Layout",
            "dxDiagram-uiLayoutTree": "Tre",
            "dxDiagram-uiLayoutLayered": "Lagdelt",
            "dxDiagram-uiDiagram": "Diagram",
            "dxDiagram-uiText": "Tekst",
            "dxDiagram-uiObject": "Objekt",
            "dxDiagram-uiConnector": "Kobling",
            "dxDiagram-uiPage": "Side",
            "dxDiagram-shapeText": "Tekst",
            "dxDiagram-shapeRectangle": "Rektangel",
            "dxDiagram-shapeEllipse": "Ellipse",
            "dxDiagram-shapeCross": "Kryss",
            "dxDiagram-shapeTriangle": "Triangel",
            "dxDiagram-shapeDiamond": "Diamant",
            "dxDiagram-shapeHeart": "Hjerte",
            "dxDiagram-shapePentagon": "Pentagon",
            "dxDiagram-shapeHexagon": "Heksagon",
            "dxDiagram-shapeOctagon": "Oktagon",
            "dxDiagram-shapeStar": "Stjerne",
            "dxDiagram-shapeArrowLeft": "Venstrepil",
            "dxDiagram-shapeArrowUp": "Pil opp",
            "dxDiagram-shapeArrowRight": "H\xf8yrepil",
            "dxDiagram-shapeArrowDown": "Pil ned",
            "dxDiagram-shapeArrowUpDown": "Opp ned pil",
            "dxDiagram-shapeArrowLeftRight": "Venstre h\xf8yre pil",
            "dxDiagram-shapeProcess": "Prosess",
            "dxDiagram-shapeDecision": "Avgj\xf8relse",
            "dxDiagram-shapeTerminator": "Terminator",
            "dxDiagram-shapePredefinedProcess": "Forh\xe5ndsdefinert prosess",
            "dxDiagram-shapeDocument": "Dokument",
            "dxDiagram-shapeMultipleDocuments": "Flere dokumenter",
            "dxDiagram-shapeManualInput": "Manuell input",
            "dxDiagram-shapePreparation": "Forberedelse",
            "dxDiagram-shapeData": "Data",
            "dxDiagram-shapeDatabase": "Database",
            "dxDiagram-shapeHardDisk": "Harddisk",
            "dxDiagram-shapeInternalStorage": "Intern lagring",
            "dxDiagram-shapePaperTape": "Papirtape",
            "dxDiagram-shapeManualOperation": "Manuell operasjon",
            "dxDiagram-shapeDelay": "Forsinkelse",
            "dxDiagram-shapeStoredData": "Lagret data",
            "dxDiagram-shapeDisplay": "Visning",
            "dxDiagram-shapeMerge": "Sl\xe5 sammen",
            "dxDiagram-shapeConnector": "Kobling",
            "dxDiagram-shapeOr": "Eller",
            "dxDiagram-shapeSummingJunction": "Summeringskryss",
            "dxDiagram-shapeContainerDefaultText": "Beholder",
            "dxDiagram-shapeVerticalContainer": "Vertikal beholder",
            "dxDiagram-shapeHorizontalContainer": "Horisontal beholder",
            "dxDiagram-shapeCardDefaultText": "Persons navn",
            "dxDiagram-shapeCardWithImageOnLeft": "Kort med bilde p\xe5 venstre side",
            "dxDiagram-shapeCardWithImageOnTop": "Kort med bilde \xf8verst",
            "dxDiagram-shapeCardWithImageOnRight": "Kort med bilde p\xe5 h\xf8yre side",
            "dxGantt-dialogTitle": "Tittel",
            "dxGantt-dialogStartTitle": "Start",
            "dxGantt-dialogEndTitle": "Slutt",
            "dxGantt-dialogProgressTitle": "Utf\xf8ring",
            "dxGantt-dialogResourcesTitle": "Ressurser",
            "dxGantt-dialogResourceManagerTitle": "Ressursforvalter",
            "dxGantt-dialogTaskDetailsTitle": "Oppgavedetaljer",
            "dxGantt-dialogEditResourceListHint": "Endre ressursliste",
            "dxGantt-dialogEditNoResources": "Ingen ressurser",
            "dxGantt-dialogButtonAdd": "Legg til",
            "dxGantt-contextMenuNewTask": "Ny oppgave",
            "dxGantt-contextMenuNewSubtask": "Ny underoppgave",
            "dxGantt-contextMenuDeleteTask": "Slett oppgave",
            "dxGantt-contextMenuDeleteDependency": "Slett avhengighet",
            "dxGantt-dialogTaskDeleteConfirmation": "Ved \xe5 slette en oppgave, s\xe5 sletter du ogs\xe5 dens avhengigheter og underoppgaver. Er du sikker p\xe5 at du \xf8nsker \xe5 slette denne oppgaven?",
            "dxGantt-dialogDependencyDeleteConfirmation": "Er du sikker p\xe5 at du \xf8nsker \xe5 slette avhengighetene fra denne oppgaven?",
            "dxGantt-dialogResourcesDeleteConfirmation": "Ved \xe5 slette en ressurs , s\xe5 sletter du den ogs\xe5 fra oppgavene der denne ressursen er tildelt. Er du sikker p\xe5 at du \xf8nsker \xe5 slette disse ressursene? Ressurs: {0}",
            "dxGantt-dialogConstraintCriticalViolationMessage": "Oppgaven du fors\xf8ker \xe5 flytte er koblet til en annen oppgave ved en avhengighetsrelasjon. Denne endringen vil v\xe6re i strid med avhengighetsregler. Hvordan \xf8nsker du \xe5 fortsette?",
            "dxGantt-dialogConstraintViolationMessage": "Oppgaven du fors\xf8ker \xe5 flytte er koblet til en annen oppgave ved en avhengighetsrelasjon. Hvordan \xf8nsker du \xe5 fortsette?",
            "dxGantt-dialogCancelOperationMessage": "Avbryt operasjonen",
            "dxGantt-dialogDeleteDependencyMessage": "Slett avhengigheten",
            "dxGantt-dialogMoveTaskAndKeepDependencyMessage": "Flytt oppgaven og behold avhengigheten",
            "dxGantt-dialogConstraintCriticalViolationSeveralTasksMessage": "TODO",
            "dxGantt-dialogConstraintViolationSeveralTasksMessage": "TODO",
            "dxGantt-dialogDeleteDependenciesMessage": "TODO",
            "dxGantt-dialogMoveTaskAndKeepDependenciesMessage": "TODO",
            "dxGantt-undo": "angre",
            "dxGantt-redo": "gj\xf8r om",
            "dxGantt-expandAll": "Utvid alle",
            "dxGantt-collapseAll": "Skjul alle",
            "dxGantt-addNewTask": "Legg til ny oppgave",
            "dxGantt-deleteSelectedTask": "Slett valgte oppgave",
            "dxGantt-zoomIn": "Zoom inn",
            "dxGantt-zoomOut": "Zoom ut",
            "dxGantt-fullScreen": "Fullskjerm",
            "dxGantt-quarter": "TODO",
            "dxGantt-sortingAscendingText": "TODO",
            "dxGantt-sortingDescendingText": "TODO",
            "dxGantt-sortingClearText": "TODO",
            "dxGantt-showResources": "TODO",
            "dxGantt-showDependencies": "TODO",
            "dxGantt-dialogStartDateValidation": "TODO",
            "dxGantt-dialogEndDateValidation": "TODO"
        }
    })
}));
