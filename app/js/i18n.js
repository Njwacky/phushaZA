/* Pusha — js/i18n.js — LANGS + the four dictionaries + t() + applyLang() + language picker */
/* ---- languages: dictionary + t() must exist before anything renders ---- */
const LANGS = [["en","English","EN"],["zu","isiZulu","ZU"],["st","Sesotho","ST"],["nr","isiNdebele","NR"]];
const I18N = {
en:{
 pdf_add_vault:"Add from Vault",pdf_vault_empty:"No PDFs saved in your Vault yet.",pdf_vault_choose:"Choose a saved PDF:",
 pdf_title:"Combine CV & PDFs",pdf_card_hint:"Add your CV and PDFs, arrange the pages, and save one PDF.",pdf_open:"Build my PDF pack",pdf_add_cv:"Add my Pusha CV",pdf_add_files:"Add PDF files",pdf_order:"Page order",pdf_empty:"No pages yet. Add your CV or a PDF.",pdf_up:"Move up",pdf_down:"Move down",pdf_remove:"Remove",pdf_save:"Download combined PDF",pdf_close:"Close",pdf_busy:"Working on your phone…",pdf_privacy:"Files are processed on this device, not uploaded. The downloaded PDF is not PIN-encrypted. Your CV is added as an image.",pdf_limits:"Up to 10 MB per PDF, 25 MB total and 100 pages. Password-protected PDFs cannot be merged. Signatures and form fields may not be preserved.",pdf_bad:"Could not open this PDF. It may be damaged or password-protected.",pdf_large:"This PDF is larger than 10 MB.",pdf_limit:"The pack is limited to 25 MB and 100 pages.",pdf_error:"Could not create the PDF. Please try again.",pdf_cv:"Pusha CV",pdf_page:"page",pdf_ready:"Pages ready",pdf_no_pages:"Add at least one page first.",pdf_cv_added:"Your CV is already in the pack.",pdf_cv_long:"Your CV is too long to add. Shorten it and try again.",pdf_done:"Your PDF is ready. Check the downloaded file before sending.",
 files_set_pin:"Set a PIN to add files",cv_template:"CV template",cv_classic:"Classic",cv_modern:"Modern",cv_simple:"Simple",
 nav_vault:"Vault",nav_pack:"Pack",nav_ideas:"Ideas",nav_money:"Money",nav_path:"Path",
 p_version:"Version",p_var_help:"Pick the one that sounds like you.",
id_chip:"A4 · about R2 at a library",docs_chip:"Tick what you have",
tool_match:"Match me",tool_start:"Start here",tool_mine:"My own idea",tool_make:"Make & sell",diy_photo_note:"Yours will look a little different — that is normal.",
diy_btn:"Show me the 10 projects",diy_title:"10 things you can make and sell",diy_lede:"No training, no machine, no studio. Pick one, buy the small list, and make the first three before you spend anything else.",diy_note:"The pictures and the step-by-step instructions stay in English for now. Prices are estimates from November 2026 — check them at your shop.",diy_cost:"To start",diy_price:"Sells for",diy_time:"Time",diy_need:"What you need",diy_need_note:"Prices are for the whole packet, not per item — most of it makes many pieces.",diy_steps:"Do this, in order",diy_sell:"Who buys it",diy_watch:"What goes wrong",diy_safety:"Be careful",diy_free:"already yours",diy_pic1:"What you need",diy_pic2:"The main move",diy_pic3:"Finished",diy_copy:"Copy the shopping list",btn_back:"Back to the list",
grip_title:"Pull that corner to make the box bigger",grip_body:"The little lines in the corner of this box are a handle. Pull them down with one finger and the box grows, so you can see everything you wrote instead of scrolling inside a small one. The box remembers its size, and you can tap the corner again any time to read this.",grip_gotit:"Got it",grip_aria:"How to make this box bigger",
lock_pin_again:"Type the PIN again",
 toast_pin_mismatch:"Those two PINs are not the same. Type the same PIN twice.",
 toast_amount_bad:"That is not an amount. Type 35 or 35.50.",
 toast_dup_line:"That line is already in your cashbook.",
 bk_replace_title:"Replace everything on this phone?",
 bk_replace_body:"This backup has %s saved items from %d. Loading it deletes what is on this phone now — details, cashbook, ideas and any PIN.",
 bk_keep_mine:"Download my data first",
 bk_replace_go:"Replace it anyway",
 warn_email:"No @ in this address — check it before you send it to anyone.",
 warn_phone:"This does not look like a phone number — check the digits.",
 v_kicker:"Step 1 · the vault",v_title:"Your details, once.",
 
 v_chip1:"On this phone only",v_chip2:"No account",
 sec_personal:"Personal",sec_school:"School & skills",sec_bank:"Banking",
 photo_title:"Your photo",photo_opt:"(optional)",
 photo_hint:"On your CV and detail sheet.",btn_addphoto:"Add photo",
 files_title:"My files",files_add:"Add files",files_note:"Files stay on this phone and are encrypted with your Vault PIN. Set a PIN before adding files.",
 files_unlock:"Unlock your Vault to access files.",files_pin_first:"Set and unlock a Vault PIN before adding files.",
 files_loading:"Loading your files…",files_one:"%s file saved on this phone.",files_count:"%s files saved on this phone.",files_empty:"No files saved yet.",
 files_download:"Download",files_remove:"Remove",files_remove_confirm:"Remove this file from this phone?",
 files_error:"Could not read or save local files. Check your device storage and try again.",
 files_decrypt_error:"Could not decrypt this file. Unlock with the correct Vault PIN and try again.",
 files_too_large:"This file is over the 10 MB limit.",files_limit:"The local file limit was reached (50 files or 25 MB total).",
 files_saving:"Saving files on this phone…",files_saved:"Saved %s file(s) on this phone.",
 files_partial:"Saved %s file(s); %d could not be saved.",files_keep_pin:"Remove saved files before removing your Vault PIN.",
 lbl_fullname:"Full name (as on ID)",lbl_id:"ID number",lbl_dob:"Date of birth",lbl_gender:"Gender",
 lbl_phone:"Phone",lbl_email:"Email",lbl_address:"Home address",lbl_kin:"Next of kin",lbl_licence:"Driver's licence",
 lbl_school:"High school",lbl_year:"Matric year",lbl_examno:"Exam / candidate number",
 lbl_subjects:"Best subjects",lbl_skills:"Skills & certificates",
 lbl_bank:"Bank",lbl_acctype:"Account type",lbl_accno:"Account number",lbl_branch:"Branch code",
 btn_save:"Save my details",
 p_title:"My pack",p_blocks:"Copy-paste blocks",p_cv:"My CV",p_sheet:"Detail sheet",
 btn_print:"Print / PDF",btn_opencv:"Open my CV",btn_copytext:"Copy as text",p_docs:"Documents checklist",
 i_title:"Idea Craft",
 btn_match:"Match ideas to me",btn_addidea:"Add my own idea",
 m_title:"Money",m_today:"Today",m_week:"This week",m_month:"This month",m_addline:"Add a line",
 m_type:"Type",m_in:"Money in",m_out:"Money out",m_amount:"Amount (R)",m_whatfor:"What for",
 btn_addcash:"Add to cashbook",m_7days:"Last 7 days",m_goal:"Savings goal",m_what:"What",m_target:"Target (R)",
 pa_title:"Your next 7 days",pa_opps:"Free things you're allowed to use",pa_scams:"Watch out for these",
 pa_about:"About this app",
 lang_title:"Language",lang_note:"Written for South Africa. Your printed CV and business plans stay in English, so any employer, bank or funder can read them.",
 cv_ready:"Your CV is ready to send",cv_needs:"Your CV needs a few things",cv_done:"done",
 bt_addsection:"Add your own section",cv_print:"Print / Save as PDF",
 cv_custom_title:"Add a section",cv_custom_hint:"Anything the CV has no field for — work experience, volunteer work, achievements, courses, languages.",
 cv_sec_work:"Work & experience",btn_add:"Add",btn_cancel:"Cancel",btn_close:"Close",
 notif_fix:"Fix", notif_ok:"Nothing missing. Print it or save it as a PDF.",
 
 
 
 
 
 
 
 m_empty:"Nothing yet. Add your first line above — even a R35 sale.",
 m_lines:"lines", m_whatph:"3 kotas at taxi rank",
 
 
 
 i_matcher2:"Ranked against your money, transport, space, time and what you like doing.",
 i_prices:"Change these to your real prices. This is the part most people skip — and it's the only part that matters.",
 cv_howto:"This is exactly what prints. Pick a missing item above to fix it, or print it at a shop for about R2.",
 cv_howto_ok:"This is exactly what prints. Print it at a shop for about R2, or choose Save as PDF.",
 what_translated:"Menus, buttons, field labels and the CV checks are translated by hand. Some long explanations stay in English.",
 inline_note:"The long explanations on these cards stay in English for now.",
 cv_still:"fields still missing",
 b_intro:"Short intro",b_intro_d:"One paragraph for WhatsApp or email",
 b_cv:"CV summary",b_cv_d:"Paste into an online application form",
 b_pitch:"Business pitch",b_pitch_d:"For a funder, mentor or partner",
 b_fund:"Funding motivation",b_fund_d:"For NYDA, SEFA or a sponsor",
 btn_copy:"Copy",b_edit:"edit it before you send",p_nblocks:"blocks",
 btn_copyshort:"Copy this",btn_copied:"Copied",btn_selected:"Selected",
 toast_copied:"Copied — paste it anywhere",toast_blocked:"Copy blocked by this browser — the text is selected, press Ctrl+C or long-press",
 d1:"Certified copy of my ID (not older than 3 months)",d2:"Original matric certificate or statement of results",
 d3:"Proof of address (letter from ward councillor, or a bill in your name)",d4:"Bank confirmation letter (get it free at your bank branch)",
 d5:"Tax number or SARS registration (only for business or formal work)",d6:"CV — 1 page, typed (use the Pack tab)",
 d7:"Two contactable references with phone numbers",d8:"Police clearance (only if the job asks — about R150 at SAPS)",
 d9:"Certified copies of qualifications or certificates",d10:"A recent photo of yourself (some learnerships ask)",
 id_hint:"We check the 13 digits. Nothing leaves this phone.",
 id_unchecked:"ID not checked", id_valid:"ID valid", id_ok:"Valid ID number. Born",
 id_ph:"13 digits", id_check:"Check it", id_bad:"That does not check out yet —", id_bad_digit:"one digit is wrong (checksum failed).", id_bad_date:"check the date part.",
 lrn_title:"Never done this before? Learn it free",lrn_zero:"Start from zero",
 lrn_skills:"What you must be able to do",lrn_practise:"Practise at home this week — free",
 lrn_where:"Where to learn it",lrn_zero_rated:"Zero-rated",lrn_data:"Needs data",
 lrn_video:"Video",lrn_photos:"Photo guide",lrn_course:"Course",
 lrn_note:"These open a website — the app itself still works offline. Watch the videos on WiFi or a night bundle, and copy one method exactly before you invent your own.",
 lrn_start_title:"NO SKILL YET? START HERE",
 lrn_method:"How to learn anything with no money",lrn_free_sa:"Free in South Africa",lrn_free_world:"Free courses and guides",
 
 cat_zero:"No skill yet",
 lock_protect_title:"Protect your vault",lock_unlock_title:"Enter your PIN",lock_lock_title:"Vault lock",
 lock_set_help:"A 6–8 digit PIN encrypts your details on this phone. Because the whole file can be copied and attacked offline, Pusha refuses short PINs and spends real time on every guess. There is no reset — if you forget it, the details can't be recovered.",
 lock_unlock_help:"Your details are encrypted on this phone.",lock_pin_label:"New PIN (6–8 digits)",lock_pin_short:"PIN",
 lock_locked_note:"Your vault is locked. Your details are encrypted on this phone.",
 btn_setpin:"Set a PIN",btn_savepin:"Set PIN and encrypt",btn_locknow:"Lock now",btn_changepin:"Change PIN",btn_rmpin:"Remove PIN",btn_unlock:"Unlock",
 btn_unlock_to_edit:"Unlock to edit",btn_yes_remove:"Yes, remove it",
 pin_weak:"Weak — easy to guess",pin_fair:"Fair",pin_strong:"Strong",pin_digits:"Digits only",
 pin_why:"A short PIN is the weak link — every extra digit makes guessing ten times harder.",pin_guess:"≈ %s of guessing",pin_too_weak:"Too easy to guess — avoid runs and repeats",
 u_year:"year",u_years:"years",u_month:"month",u_months:"months",u_day:"day",u_days:"days",
 u_hour:"hour",u_hours:"hours",u_min:"min",u_mins:"min",u_sec:"sec",u_secs:"sec",
 pin_wait:"Too many tries. Wait %s seconds.",
 lock_rm_confirm:"Remove the PIN? Your details stay on this phone, but they will no longer be encrypted.",
 toast_pin_short:"Use at least 6 digits",toast_pin_short_unlock:"Use at least 4 digits",toast_pin_bad:"Wrong PIN",toast_unlocked:"Unlocked",
 toast_locked:"Locked — your details are encrypted on this phone",
 toast_pin_set:"PIN set — your details are now encrypted on this phone",
 toast_pin_removed:"PIN removed — your details are no longer encrypted",
 store_full:"Phone storage is full — your last change was not saved.",
 bk_note:"Your details and attached files stay on this phone. A backup file is the only way to move them to a new phone or recover them after browser data is cleared.",
 store_help:"Save a backup, then delete a photo or some cashbook lines to make room.",
 toast_saved:"Saved to this phone",toast_nosave:"Not saved — phone storage is full",
 toast_save_failed:"Could not save — try again",toast_restored:"Restored",
 toast_unlock_first:"Unlock the vault first",toast_not_image:"That is not an image",
 toast_photo_bad:"Could not read that photo",toast_photo_added:"Photo added — it is on your CV now",
 toast_photo_removed:"Photo removed",toast_print_blocked:"Download the file and open it in a browser to print",
 toast_price_first:"Put in your price first",toast_name_first:"Give your idea a name first",
 toast_deleted:"Deleted",toast_error:"Something went wrong — your saved data is safe",
 toast_amount_first:"Put in an amount first",toast_cash_added:"Added to the cashbook",
 toast_locked_in:"Locked in",btn_undo:"Undo",btn_share:"Share",
 btn_rmphoto:"Remove photo",se_ph:"Search ideas — type a word",se_none:"Nothing matches that",
 bk_title:"Backup",btn_bk_save:"Save a backup file",btn_bk_load:"Load a backup",
 bk_done:"Backup downloaded",bk_loaded:"Backup loaded",bk_bad:"That file is not a Pusha backup",bk_too_large:"This backup is too large to export from this phone.",bk_restore_failed:"Restore failed and your previous data may not be fully recovered. Keep this page open and use your backup file.",
 bk_confirm:"Replace everything on this phone with the backup?",
 bk_enc_note:"Your backup keeps the PIN encryption — without the PIN the vault inside cannot be opened.",
 bk_plain_note:"This backup is not encrypted. Anyone who opens the file can read your details.",
 cv_pdf_hint:"On a phone: tap Print, then choose “Save as PDF”.",
 fresh:"Prices: November 2026 — confirm before you spend.",
 al_title:"Auto-lock",al_off:"Off",al_1:"After 1 minute",al_5:"After 5 minutes",al_15:"After 15 minutes",
 fb_title:"Tell us what is wrong",fb_btn:"Copy a report",fb_copied:"Copied — paste it into an SMS or an email.",
 fb_help:"Copy the report, or send it straight to us. Nothing is sent automatically.",
 btn_export:"Copy my cashbook",btn_delline:"Delete this line",

ct_title:"Spotted a mistake? Tell us",ct_call:"Call or SMS",ct_mail:"Email",ct_note:"Free to message. Nothing is sent unless you tap.",fb_send_email:"Send it by email",ct_wa_note:"Send us a message — free",fb_send_wa:"Send on WhatsApp",ios_title:"Keep this on your iPhone",ios_body:"iPhone deletes a website's saved details after 7 days without a visit. On the home screen it does not.",ios_step1:"Tap Share at the bottom of Safari.",ios_step2:"Choose “Add to Home Screen”, then open Pusha from the new icon.",ios_ok:"Got it",ios_backup:"Save a backup",ios_later:"Not now"},
zu:{
 pdf_add_vault:"Faka okuvela kuVault",pdf_vault_empty:"Awekho ama-PDF agcinwe kuVault.",pdf_vault_choose:"Khetha i-PDF egciniwe:",
 pdf_title:"Hlanganisa i-CV nama-PDF",pdf_card_hint:"Faka i-CV nama-PDF, hlela amakhasi bese ugcina i-PDF eyodwa.",pdf_open:"Yenza iphakethe le-PDF",pdf_add_cv:"Faka i-CV yami yePusha",pdf_add_files:"Faka amafayela e-PDF",pdf_order:"Ukuhleleka kwamakhasi",pdf_empty:"Awekho amakhasi. Faka i-CV noma i-PDF.",pdf_up:"Hambisa phezulu",pdf_down:"Hambisa phansi",pdf_remove:"Susa",pdf_save:"Dawuniloda i-PDF",pdf_close:"Vala",pdf_busy:"Kusalungiswa kule foni…",pdf_privacy:"Amafayela asetshenzwa kule foni, awathunyelwa. I-PDF elandiwe ayivikelwe nge-PIN. I-CV ifakwa njengesithombe.",pdf_limits:"Ifayela ngalinye: 10 MB; isamba: 25 MB namakhasi 100. Ama-PDF anephasiwedi awasebenzi. Amasiginesha nezinkambu zamafomu zingase zingagcinwa.",pdf_bad:"Le PDF ayivuleki. Kungenzeka yonakele noma inephasiwedi.",pdf_large:"Le PDF ingaphezu kuka-10 MB.",pdf_limit:"Umkhawulo ngu-25 MB namakhasi 100.",pdf_error:"I-PDF ayenziwanga. Zama futhi.",pdf_cv:"I-CV yePusha",pdf_page:"ikhasi",pdf_ready:"Amakhasi alungile",pdf_no_pages:"Faka okungenani ikhasi elilodwa.",pdf_cv_added:"I-CV yakho isivele ikhona.",pdf_cv_long:"I-CV yinde kakhulu. Yifinyeze uzame futhi.",pdf_done:"I-PDF isilungile. Yihlole ngaphambi kokuyithumela.",
 files_set_pin:"Setha i-PIN ukufaka amafayela",cv_template:"Isifanekiso se-CV",cv_classic:"Okwakudala",cv_modern:"Okwesimanje",cv_simple:"Okulula",
 nav_vault:"Umqulu",nav_pack:"Iphakethe",nav_ideas:"Imibono",nav_money:"Imali",nav_path:"Indlela",
 p_version:"Inguqulo",p_var_help:"Khetha lowo ozwakala njengawe.",
id_chip:"A4 · cishe R2 emtatsheni wezincwadi",docs_chip:"Beka uphawu kokunakho",
tool_match:"Ngifanise",tool_start:"Qala lapha",tool_mine:"Umbono wami",tool_make:"Yenza & thengisa",diy_photo_note:"Okwakho kuzobukeka kwehluke kancane — lokho kujwayelekile.",
diy_btn:"Ngikhombise izinto ezi-10",diy_title:"Izinto ezi-10 ongazenza futhi uzithengise",diy_lede:"Akukho kuqeqeshwa, akukho mshini, akukho studio. Khetha okukodwa, thenga uhlu oluncane, futhi wenze ezintathu zokuqala ngaphambi kokusebenzisa enye imali.",diy_note:"Izithombe neziyalezo zigcina zingesiNgisi okwamanje. Amanani ayizilinganiso zangoNovemba 2026 — wahlole esitolo sakho.",diy_cost:"Ukuqala",diy_price:"Kuthengiswa",diy_time:"Isikhathi",diy_need:"Okudingayo",diy_need_note:"Amanani awepakethe eliphelele, hhayi into ngayinye — iningi lenza izingcezu eziningi.",diy_steps:"Yenza lokhu, ngokulandelana",diy_sell:"Ubani othengayo",diy_watch:"Okungahamba kabi",diy_safety:"Qaphela",diy_free:"kungokwakho kakade",diy_pic1:"Okudingayo",diy_pic2:"Isinyathelo esikhulu",diy_pic3:"Sekuphelile",diy_copy:"Kopisha uhlu lwezokuthenga",btn_back:"Buyela ohlwini",
grip_title:"Hudula lelo khona ukuze ibhokisi libe likhulu",grip_body:"Imigqa emincane ekhoneni laleli bhokisi iyisibambo. Yihudulele phansi ngomunwe owodwa, ibhokisi liyakhula, ukuze ubone konke okubhalile esikhundleni sokuskrolla ebhokisini elincane. Ibhokisi likhumbula usayizi walo, futhi ungathinta ikhona futhi noma nini ukufunda lokhu.",grip_gotit:"Ngiqondile",grip_aria:"Indlela yokwenza leli bhokisi libe likhulu",
lock_pin_again:"Bhala i-PIN futhi",
 toast_pin_mismatch:"Lawo ma-PIN amabili awafani. Bhala i-PIN efanayo kabili.",
 toast_amount_bad:"Leyo akuyona imali. Bhala 35 noma 35.50.",
 toast_dup_line:"Lowo mugqa usuvele ukhona kwi-cashbook yakho.",
 bk_replace_title:"Faka konke esikhundleni kule foni?",
 bk_replace_body:"Leli khophi yokugcina linokungu-%s okugciniwe kusukela %d. Uma ulifaka, kususwa konke okukule foni manje — imininingwane, i-cashbook, imibono ne-PIN.",
 bk_keep_mine:"Landa idatha yami kuqala",
 bk_replace_go:"Faka noma kunjalo",
 warn_email:"Akukho @ kuleli kheli — lihlole ngaphambi kokulithumela.",
 warn_phone:"Lokhu akubonakali njengenombolo yocingo — hlola izinombolo.",
 v_kicker:"Isinyathelo 1 · umqulu",v_title:"Imininingwane yakho, kanye.",
 
 v_chip1:"Kule foni kuphela",v_chip2:"Akukho akhawunti",
 sec_personal:"Okwakho",sec_school:"Isikole namakhono",sec_bank:"Ibhange",
 photo_title:"Isithombe sakho",photo_opt:"(ngokuzithandela)",
 photo_hint:"Kwi-CV nesheet yemininingwane.",btn_addphoto:"Faka isithombe",
 files_title:"Amafayela ami",files_add:"Faka amafayela",files_note:"Amafayela ahlala kule foni futhi avikelwe nge-PIN yeVault. Faka i-PIN ngaphambi kokuwafaka.",
 files_unlock:"Vula iVault ukuze uthole amafayela.",files_pin_first:"Faka bese uvula i-PIN yeVault ngaphambi kokufaka amafayela.",
 files_loading:"Kulayishwa amafayela…",files_one:"Ifayela elingu-%s ligciniwe kule foni.",files_count:"Amafayela angu-%s agciniwe kule foni.",files_empty:"Awukagcini mafayela.",
 files_download:"Dawuniloda",files_remove:"Susa",files_remove_confirm:"Ususe leli fayela kule foni?",
 files_error:"Amafayela akugcinwanga. Hlola indawo yokugcina kule foni uzame futhi.",
 files_decrypt_error:"Leli fayela alivulekanga. Vula nge-PIN yeVault efanele bese uzama futhi.",
 files_too_large:"Leli fayela lidlula umkhawulo ongu-10 MB.",files_limit:"Umkhawulo wamafayela usufinyelelwe (50 noma 25 MB sezizonke).",
 files_saving:"Kugcinwa amafayela kule foni…",files_saved:"Kugciniwe amafayela angu-%s kule foni.",
 files_partial:"Kugciniwe amafayela angu-%s; angu-%d awagcinwanga.",files_keep_pin:"Susa amafayela agciniwe ngaphambi kokususa i-PIN yeVault.",
 lbl_fullname:"Igama eliphelele (njengaku-ID)",lbl_id:"Inombolo ye-ID",lbl_dob:"Usuku lokuzalwa",
 lbl_gender:"Ubulili",lbl_phone:"Ucingo",lbl_email:"I-imeyili",lbl_address:"Ikheli lasekhaya",
 lbl_kin:"Ongathinta uma kunesidingo",lbl_licence:"Ilayisensi yokushayela",
 lbl_school:"Isikole samabanga aphezulu",lbl_year:"Unyaka kamatric",lbl_examno:"Inombolo yokuhlolwa",
 lbl_subjects:"Izifundo eziphambili",lbl_skills:"Amakhono nezitifiketi",
 lbl_bank:"Ibhange",lbl_acctype:"Uhlobo lwe-akhawunti",lbl_accno:"Inombolo ye-akhawunti",lbl_branch:"Ikhodi yegatsha",
 btn_save:"Gcina imininingwane yami",
 p_title:"Iphakethe lami",p_blocks:"Amabhulokhi okukopisha",p_cv:"I-CV yami",p_sheet:"Iphepha lemininingwane",
 btn_print:"Phrinta / PDF",btn_opencv:"Vula i-CV yami",btn_copytext:"Kopisha njengombhalo",p_docs:"Uhlu lwamadokhumende",
 i_title:"Imibono yebhizinisi",
 btn_match:"Ngihlanganisele imibono",btn_addidea:"Faka umbono wami",
 m_title:"Imali",m_today:"Namuhla",m_week:"Leli sonto",m_month:"Le nyanga",m_addline:"Faka umugqa",
 m_type:"Uhlobo",m_in:"Imali engenayo",m_out:"Imali ephumayo",m_amount:"Inani (R)",m_whatfor:"Kungani",
 btn_addcash:"Faka encwadini yemali",m_7days:"Izinsuku eziyi-7 ezedlule",m_goal:"Inhloso yokonga",
 m_what:"Ini",m_target:"Inhloso (R)",
 pa_title:"Izinsuku zakho eziyi-7 ezizayo",pa_opps:"Izinto zamahhala ongazisebenzisa",pa_scams:"Qaphela lezi",
 pa_about:"Mayelana nalolu hlelo",
 lang_title:"Ulimi",lang_note:"Yazalelwa iNingizimu Afrika. I-CV yakho namaphrojekthi ebhizinisi kuse-Singisi ukuze umqashi, ibhange noma umxhasi akwazi ukuyifunda.",
 cv_ready:"I-CV yakho ilungele ukuthunyelwa",cv_needs:"I-CV yakho idinga izinto ezimbalwa",cv_done:"kwenziwe",
 bt_addsection:"Faka isigaba sakho",cv_print:"Phrinta / Gcina njenge-PDF",
 cv_custom_title:"Faka isigaba",cv_custom_hint:"Noma yini i-CV engenayo indawo yayo — umsebenzi, ukuzithandela, impumelelo, izifundo, izilimi.",
 cv_sec_work:"Umsebenzi namava",btn_add:"Faka",btn_cancel:"Hoxa",btn_close:"Vala",
 notif_fix:"Lungisa", notif_ok:"Akukho okushodayo. Phrinta noma gcina njenge-PDF.",
 
 
 
 
 
 
 
 m_empty:"Akukho lutho okwamanje. Faka umugqa wakho wokuqala ngenhla — ngisho nokuthengisa ngo-R35.",
 m_lines:"imigqa", m_whatph:"ama-kota ama-3 emakethe",
 
 
 
 i_matcher2:"Kuhlelwe ngokwemali yakho, ezokuhamba, indawo, isikhathi nokuthanda kwakho.",
 i_prices:"Shintsha lezi zibe yimanani yakho yangempela. Le yingxenye abantu abaningi abayeqayo — futhi iyona kuphela ebalulekile.",
 cv_howto:"Lokhu yikho okunyatheliswayo. Khetha into engekho ngenhla ukuze uyilungise, noma uyiprinte esitolo ngo-R2.",
 cv_howto_ok:"Lokhu yikho okunyatheliswayo. Yiprinte esitolo ngo-R2, noma khetha Boloka njenge-PDF.",
 what_translated:"Amamenyu, izinkinobho, amagama ezinkambu nokuhlolwa kwe-CV kuhunyushwe ngesandla. Ezinye izincazelo ezinde zise-Singisi.",
 inline_note:"Izincazelo ezinde kula makhadi zise-Singisi okwamanje.",
 cv_still:"izinkambu zisashoda",
 b_intro:"Isethulo esifushane",b_intro_d:"Isigaba esisodwa se-WhatsApp noma i-imeyili",
 b_cv:"Isifingqo se-CV",b_cv_d:"Namathisela efomini lokucela ku-inthanethi",
 b_pitch:"Isethulo sebhizinisi",b_pitch_d:"Sabaxhasi, abeluleki noma abalingani",
 b_fund:"Isizathu socelo lwemali",b_fund_d:"Se-NYDA, i-SEFA noma umxhasi",
 btn_copy:"Kopisha",b_edit:"hlela ngaphambi kokuthumela",p_nblocks:"amabhulokhi",
 btn_copyshort:"Kopisha lokhu",btn_copied:"Kukopishiwe",btn_selected:"Kukhethiwe",
 toast_copied:"Kukopishiwe — namathisela noma kuphi",toast_blocked:"Ikhopi ivinjelwe yilesi siphequluli — umbhalo ukhethiwe, cindezela Ctrl+C noma ubambe isikhathi eside",
 d1:"Ikhophi eqinisekisiwe ye-ID yami (engeyona endala kunezinyanga ezi-3)",d2:"Isitifiketi sokuqala sikamatric noma isitatimende semiphumela",
 d3:"Ubufakazi bekheli (incwadi evela kukhansela wasewadini, noma ibhili egameni lakho)",d4:"Incwadi yokuqinisekisa yasebhange (yithole mahhala egatsheni lakho lebhange)",
 d5:"Inombolo yentela noma ukubhaliswa kwe-SARS (kuphela kwebhizinisi noma umsebenzi osemthethweni)",d6:"I-CV — ikhasi eli-1, ebhalwe ngomshini (sebenzisa ithebhu yePhakethe)",
 d7:"Abantu ababili ongathintana nabo abanezinombolo zocingo",d8:"Imvume yamaphoyisa (kuphela uma umsebenzi uyicela — cishe R150 eSAPS)",
 d9:"Amakhophi aqinisekisiwe eziqu nezitifiketi",d10:"Isithombe sakho sakamuva (amanye ama-learnership ayasidinga)",
 id_hint:"Sihlola izinombolo ezi-13. Akukho okukhulumayo okuphumayo kule foni.",
 id_unchecked:"I-ID ayikalohlwa", id_valid:"I-ID ivumelekile", id_ok:"Inombolo ye-ID ivumelekile. Uzalwe",
 id_ph:"amadijithi ayi-13", id_check:"Hlola", id_bad:"Lokhu akuhambisani okwamanje —", id_bad_digit:"idijithi eyodwa ayilungile.", id_bad_date:"hlola ingxenye yosuku.",
 lrn_title:"Awukaze uwenze? Funda mahhala",lrn_zero:"Qala kusukela ku-zero",
 lrn_skills:"Okufanele ukwazi ukukwenza",lrn_practise:"Zijwayeze ekhaya leli sonto — mahhala",
 lrn_where:"Kuphi ongakufunda khona",lrn_zero_rated:"Akudli idatha",lrn_data:"Kudinga idatha",
 lrn_video:"Ividiyo",lrn_photos:"Umhlahlandlela wezithombe",lrn_course:"Isifundo",
 lrn_note:"Lezi zivula iwebhusayithi — uhlelo ngokwalo lusebenza ngaphandle kwe-inthanethi. Buka amavidiyo nge-WiFi noma nge-night bundle, bese ulandela indlela eyodwa ngqo ngaphambi kokwakha eyakho.",
 lrn_start_title:"AWUKABI YIKHONO? QALA LAPHA",
 lrn_method:"Indlela yokufunda noma yini ngaphandle kwemali",lrn_free_sa:"Mahhala eNingizimu Afrika",lrn_free_world:"Izifundo nemihlahlandlela yamahhala",
 
 cat_zero:"Akukho khono",
 lock_protect_title:"Vikela umqulu wakho",lock_unlock_title:"Faka i-PIN yakho",lock_lock_title:"Ukukhiya umqulu",
 lock_set_help:"I-PIN yamadijithi ama-6–8 ifihla imininingwane yakho kule foni. Ngoba lonke ifayela lingakhotshelwa lihlaselwe ngaphandle, i-Pusha yenqaba ama-PIN amafitshane futhi isebenzisa isikhathi esiningi ekuguqeleni. Akukho okokuyikhohlwa — uma uyikhohlwa, imininingwane ayikwazi ukubuyiswa.",
 lock_unlock_help:"Imininingwane yakho ifihliwe kule foni.",lock_pin_label:"I-PIN entsha (amadijithi ama-6–8)",lock_pin_short:"I-PIN",
 lock_locked_note:"Umqulu wakho ukhiyiwe. Imininingwane yakho ifihliwe kule foni.",
 btn_setpin:"Beka i-PIN",btn_savepin:"Beka i-PIN bese ufihla",btn_locknow:"Khiya manje",btn_changepin:"Shintsha i-PIN",btn_rmpin:"Susa i-PIN",btn_unlock:"Vula",
 btn_unlock_to_edit:"Vula ukuze uhlele",btn_yes_remove:"Yebo, yisuse",
 pin_weak:"Ibuthakathaka — kulula ukuyiqagela",pin_fair:"Kulingene",pin_strong:"Iqinile",pin_digits:"Amadijithi kuphela",
 pin_why:"I-PIN emfitshane ilula ukuyiqagela — idijithi ngayinye yenza kube nzima kakhulu.",pin_guess:"≈ %s ukuqagela",pin_too_weak:"Kulula ukuyiqagela — gwema ukulandelana nokuphinda",
 u_year:"unyaka",u_years:"iminyaka",u_month:"inyanga",u_months:"izinyanga",u_day:"usuku",u_days:"izinsuku",
 u_hour:"ihora",u_hours:"amahora",u_min:"umzuzu",u_mins:"imizuzu",u_sec:"umzuzwana",u_secs:"imizuzwana",
 pin_wait:"Uzame kaningi. Linda imizuzwana engu-%s.",
 lock_rm_confirm:"Susa i-PIN? Imininingwane yakho isahlala kule foni, kodwa ayisazofihlwa.",
 toast_pin_short:"Sebenzisa amadijithi ama-6 nangaphezulu",toast_pin_short_unlock:"Sebenzisa amadijithi ama-4 nangaphezulu",toast_pin_bad:"I-PIN ayilunganga",toast_unlocked:"Kuvuliwe",
 toast_locked:"Kukhiyiwe — imininingwane yakho ifihliwe kule foni",
 toast_pin_set:"I-PIN ibekiwe — imininingwane yakho isifihliwe kule foni",
 toast_pin_removed:"I-PIN isusiwe — imininingwane yakho ayisafihliwe",
 store_full:"Isikhala sifile — ushintsho lwakho lokugcina alukagcinwa.",
 bk_note:"Imininingwane namafayela akho agcinwa kule foni. Ikhopi kuphela engakusa efonini entsha noma ikubuyisele ngemva kokusula idatha yesiphequluli.",
 store_help:"Gcina ikhopi, bese ususa isithombe noma imigqa yencwadi yemali ukuze kube nesikhala.",
 toast_saved:"Kugcinwe kule foni",toast_nosave:"Akukugcinwanga — isikhala sifile",
 toast_save_failed:"Akukgcinwanga — zama futhi",toast_restored:"Kubuyisiwe",
 toast_unlock_first:"Vula umqulu kuqala",toast_not_image:"Lokho akusona isithombe",
 toast_photo_bad:"Asikwazanga ukufunda isithombe",toast_photo_added:"Isithombe sengeziwe — sise-CV yakho manje",
 toast_photo_removed:"Isithombe sisusiwe",toast_print_blocked:"Landa ifayela bese ulivula kusiphequluli ukuze uprinte",
 toast_price_first:"Faka intengo yakho kuqala",toast_name_first:"Qamba ibizo lomqondo wakho kuqala",
 toast_deleted:"Kususiwe",toast_error:"Kukhona okungahambanga kahle — idatha yakho iphephile",
 toast_amount_first:"Faka isamba kuqala",toast_cash_added:"Kungezwe encwadini yemali",
 toast_locked_in:"Kuqinisekisiwe",btn_undo:"Buyisela",btn_share:"Yabelana",
 btn_rmphoto:"Susa isithombe",se_ph:"Sesha imibono — bhala igama",se_none:"Akukho okuhambisanayo",
 bk_title:"Ikhopi",btn_bk_save:"Gcina ifayela lekhopi",btn_bk_load:"Layisha ikhopi",
 bk_done:"Ikhopi ilandiwe",bk_loaded:"Ikhopi ilayishiwe",bk_bad:"Leli fayela akulona ikhopi le-Pusha",bk_too_large:"Leli khopi likhulu kakhulu ukuthi lingakhishelwa kule foni.",
 bk_confirm:"Faka ikhopi esikhundleni sakho konke kule foni?",
 bk_enc_note:"Ikhopi yakho igcina ukufihlwa kwe-PIN — ngaphandle kwe-PIN umqulu ngaphakathi awukwazi ukuvulwa.",
 bk_plain_note:"Le khopi ayifihliwe. Noma ubani ovula ifayela angafunda imininingwane yakho.",
 cv_pdf_hint:"Kufoni: cindezela u-Print bese ukhetha u-“Save as PDF”.",
 fresh:"Amanani: Novemba 2026 — qinisekisa ngaphambi kokuthenga.",
 al_title:"Ukukhiya ngokuzenzakalela",al_off:"Kucishiwe",al_1:"Ngemva komzuzu o-1",al_5:"Ngemva kwemizuzu e-5",al_15:"Ngemva kwemizuzu e-15",
 fb_title:"Sitshele okungahambanga kahle",fb_btn:"Khopisha umbiko",fb_copied:"Kukopishiwe — kunamathisele ku-SMS noma ku-imeyili.",
 fb_help:"Khopisha umbiko, noma uwuthumele ngqo kithi. Akukho okuthunyelwayo ngokuzenzakalela.",
 btn_export:"Khopisha incwadi yami yemali",btn_delline:"Susa lo mugqa",

ct_title:"Ubonile iphutha? Sitshele",ct_call:"Shayela noma thumela i-SMS",ct_mail:"I-imeyili",ct_note:"Kumahhala ukuthumela umlayezo. Akukho okuthunyelwayo ngaphandle kokuthi ucofe.",fb_send_email:"Yithumele nge-imeyili",ct_wa_note:"Sithumelele umlayezo — kumahhala",fb_send_wa:"Thumela nge-WhatsApp",ios_title:"Gcina lokhu ku-iPhone yakho",ios_body:"I-iPhone isusa imininingwane egciniwe yewebhusayithi ngemva kwezinsuku ezi-7 ngaphandle kokuvakasha. Esikrinini sasekhaya ayikwenzi lokho.",ios_step1:"Thinta u-Share ngezansi kwe-Safari.",ios_step2:"Khetha “Add to Home Screen”, bese uvula i-Pusha kusithonjana esisha.",ios_ok:"Ngizwile",ios_backup:"Gcina ikhophi",ios_later:"Hhayi manje"},
st:{
 pdf_add_vault:"Kenya ho tswa ho Vault",pdf_vault_empty:"Ha ho di-PDF tse bolokilweng ho Vault.",pdf_vault_choose:"Kgetha PDF e bolokilweng:",
 pdf_title:"Kopanya CV le di-PDF",pdf_card_hint:"Kenya CV le di-PDF, hlophisa maqephe mme o boloke PDF e le nngwe.",pdf_open:"Etsa pakete ya PDF",pdf_add_cv:"Kenya CV ya ka ya Pusha",pdf_add_files:"Kenya difaele tsa PDF",pdf_order:"Tatelano ya maqephe",pdf_empty:"Ha ho maqephe. Kenya CV kapa PDF.",pdf_up:"Isa hodimo",pdf_down:"Isa tlase",pdf_remove:"Tlosa",pdf_save:"Jarolla PDF e kopantsweng",pdf_close:"Kwala",pdf_busy:"E sebetsa fonong ena…",pdf_privacy:"Difaele di sebetswa fonong ena, ha di romelwe. PDF e jarollotsweng ha e a sireletswa ka PIN. CV e kenngwa e le setshwantsho.",pdf_limits:"Ho fihla ho 10 MB faeleng, 25 MB kaofela le maqephe a 100. Di-PDF tse nang le phasewete ha di sebetse. Mesaeno le dikarolo tsa diforomo di ka nna tsa se bolokwe.",pdf_bad:"PDF ena ha e bulehe. E ka nna ya senyeha kapa ya ba le phasewete.",pdf_large:"PDF ena e feta 10 MB.",pdf_limit:"Moedi ke 25 MB le maqephe a 100.",pdf_error:"PDF ha e a etswa. Leka hape.",pdf_cv:"CV ya Pusha",pdf_page:"leqephe",pdf_ready:"Maqephe a lokile",pdf_no_pages:"Kenya bonyane leqephe le le leng.",pdf_cv_added:"CV ya hao e se e le teng.",pdf_cv_long:"CV e telele haholo. E kgutsufatse o leke hape.",pdf_done:"PDF e lokile. E hlahlobe pele o e romela.",
 files_set_pin:"Beha PIN ho kenya difaele",cv_template:"Sebopeho sa CV",cv_classic:"Tlwaelehileng",cv_modern:"Sejwalejwale",cv_simple:"Bonolo",
 nav_vault:"Polokelo",nav_pack:"Pakete",nav_ideas:"Mehopolo",nav_money:"Chelete",nav_path:"Tsela",
 p_version:"Mofuta",p_var_help:"Kgetha eo e utlwahalang jwaloka wena.",
id_chip:"A4 · hoo e ka bang R2 laebraring",docs_chip:"Tshwaya seo o nang le sona",
tool_match:"Ntshwanise",tool_start:"Qala mona",tool_mine:"Mohopolo wa ka",tool_make:"Etsa & rekisa",diy_photo_note:"Ya hao e tla shebahala e fapana hanyenyane — seo se tlwaelehile.",
diy_btn:"Mpontshe dintho tse 10",diy_title:"Dintho tse 10 tseo o ka di etsang le ho di rekisa",diy_lede:"Ha ho thupelo, ha ho motjhini, ha ho studio. Kgetha e le nngwe, reka lenane le le nyenyane, mme o etse tse tharo tsa pele pele o sebedisa tjhelete e nngwe.",diy_note:"Ditshwantsho le ditaelo di sala ka Senyesemane ha joale. Ditheko ke dikhakanyo tsa November 2026 — di hlahlobe lebenkeleng la hao.",diy_cost:"Ho qala",diy_price:"E rekiswa",diy_time:"Nako",diy_need:"Seo o se hlokang",diy_need_note:"Ditheko ke tsa pakete kaofela, e seng ntho ka nngwe — bongata ba yona bo etsa dikarolo tse ngata.",diy_steps:"Etsa sena, ka tatellano",diy_sell:"Ke mang ya rekang",diy_watch:"Se ka senyehang",diy_safety:"Hlokomela",diy_free:"ke ya hao e sa le",diy_pic1:"Seo o se hlokang",diy_pic2:"Mohato wa bohlokwa",diy_pic3:"E fedile",diy_copy:"Kopitsa lenane la ho reka",btn_back:"Kgutlela lenaneng",
grip_title:"Hula khutlo eo hore lebokose le be leholo",grip_body:"Mela e menyenyane khutlong ya lebokose lena ke setshoari. E hulele tlase ka monwana o le mong, mme lebokose le a hola, e le hore o bone sohle seo o se ngotseng ho e-na le ho skrola ka hare ho lebokose le lenyenyane. Lebokose le hopola boholo ba lona, mme o ka tobetsa khutlo hape neng kapa neng ho bala sena.",grip_gotit:"Ke utlwisisa",grip_aria:"Kamoo o ka etsang lebokose lena leholo",
lock_pin_again:"Ngola PIN hape",
 toast_pin_mismatch:"Dikgetho-pin tsena tse pedi ha di tshwane. Ngola PIN e tshwanang habeli.",
 toast_amount_bad:"Seo ha se chelete. Ngola 35 kapa 35.50.",
 toast_dup_line:"Mola oo o se o ngotsoe ka har'a cashbook ea hau.",
 bk_replace_title:"Kenya tsohle sebakeng sa tse teng fonong ena?",
 bk_replace_body:"Khopi ena e na le dintho tse %s tse bolokiloeng ho tloha %d. Ha e kenngoa, ho tlosoa tsohle tse teng fonong ena hona joale — dintlha, cashbook, mehopolo le PIN.",
 bk_keep_mine:"Khoasolla data ya ka pele",
 bk_replace_go:"Kenya leha ho le joalo",
 warn_email:"Ha ho @ atereseng ena — e hlahlobe pele o e romela.",
 warn_phone:"Sena ha se shebahale e le nomoro ya mohala — hlahloba dinomoro.",
 v_kicker:"Mohato 1 · polokelo",v_title:"Lintlha tsa hao, hang.",
 
 v_chip1:"Foneng ena feela",v_chip2:"Ha ho akhaonto",
 sec_personal:"Tsa hao",sec_school:"Sekolo le bokgoni",sec_bank:"Banka",
 photo_title:"Senepe sa hao",photo_opt:"(boikhethelo)",
 photo_hint:"Ho CV le sheete ya dintlha.",btn_addphoto:"Kenya senepe",
 files_title:"Difaele tsa ka",files_add:"Kenya difaele",files_note:"Difaele di sala fonong ena mme di sireleditswe ka PIN ya Vault. Beha PIN pele o kenya difaele.",
 files_unlock:"Notlolla Vault ho fumana difaele.",files_pin_first:"Beha o notlolle PIN ya Vault pele o kenya difaele.",
 files_loading:"E kenya difaele…",files_one:"Faele e le nngwe e bolokilwe fonong ena.",files_count:"Difaele tse %s di bolokilwe fonong ena.",files_empty:"Ha ho difaele tse bolokilweng.",
 files_download:"Jarolla",files_remove:"Tlosa",files_remove_confirm:"Tlosa faele ena fonong ee?",
 files_error:"Difaele ha di a bolokwa. Lekola sebaka sa polokelo fonong mme o leke hape.",
 files_decrypt_error:"Faele ena ha e a buleha. Notlolla ka PIN e nepahetseng ya Vault mme o leke hape.",
 files_too_large:"Faele ena e feta moedi wa 10 MB.",files_limit:"Moedi wa difaele o fihletswe (50 kapa 25 MB kaofela).",
 files_saving:"E boloka difaele fonong ena…",files_saved:"Difaele tse %s di bolokilwe fonong ena.",
 files_partial:"Difaele tse %s di bolokilwe; tse %d ha di a bolokwa.",files_keep_pin:"Tlosa difaele tse bolokilweng pele o tlosa PIN ya Vault.",
 lbl_fullname:"Lebitso le felletseng (joalo ka ID)",lbl_id:"Nomoro ea ID",lbl_dob:"Letsatsi la tsoalo",
 lbl_gender:"Bong",lbl_phone:"Mohala",lbl_email:"Imeile",lbl_address:"Aterese ea lapeng",
 lbl_kin:"Motho oa ho ikopanya le eena",lbl_licence:"Laesense ea ho khanna",
 lbl_school:"Sekolo se phahameng",lbl_year:"Selemo sa matric",lbl_examno:"Nomoro ea tlhahlobo",
 lbl_subjects:"Lithuto tse ntle",lbl_skills:"Bokgoni le litifikeiti",
 lbl_bank:"Banka",lbl_acctype:"Mofuta oa akhaonto",lbl_accno:"Nomoro ea akhaonto",lbl_branch:"Khoutu ea lekala",
 btn_save:"Boloka lintlha tsa ka",
 p_title:"Pakete ea ka",p_blocks:"Likarolo tsa ho kopitsa",p_cv:"CV ea ka",p_sheet:"Leqephe la lintlha",
 btn_print:"Hatisa / PDF",btn_opencv:"Bula CV ea ka",btn_copytext:"Kopitsa e le mongolo",p_docs:"Lenane la litokomane",
 i_title:"Mehopolo ea khoebo",
 btn_match:"Nkgokahanye le mehopolo",btn_addidea:"Kenya mohopolo oa ka",
 m_title:"Chelete",m_today:"Kajeno",m_week:"Beki ena",m_month:"Khoeli ena",m_addline:"Kenya mola",
 m_type:"Mofuta",m_in:"Chelete e kenang",m_out:"Chelete e tsoang",m_amount:"Chelete (R)",m_whatfor:"Ea eng",
 btn_addcash:"Kenya bukeng ea chelete",m_7days:"Matsatsi a 7 a fetileng",m_goal:"Sepheo sa ho boloka",
 m_what:"Eng",m_target:"Sepheo (R)",
 pa_title:"Matsatsi a hao a 7 a tlang",pa_opps:"Lintho tsa mahala tseo o li lumelloang",pa_scams:"Hlokomela tsena",
 pa_about:"Mabapi le sesebelisoa sena",
 lang_title:"Puo",lang_note:"E ngoletsoe Afrika Boroa. CV ea hao le merero ea khoebo li ntse li le Senyesemane e le hore mohiri, banka kapa motšehetsi a tsebe ho li bala.",
 cv_ready:"CV ea hao e loketse ho romeloa",cv_needs:"CV ea hao e hloka lintho tse 'maloa",cv_done:"e entsoe",
 bt_addsection:"Kenya karolo ea hao",cv_print:"Hatisa / Boloka e le PDF",
 cv_custom_title:"Kenya karolo",cv_custom_hint:"Ntho leha e le efe eo CV e se nang sebaka sa eona — mosebetsi, boithaopo, katleho, lithuto, lipuo.",
 cv_sec_work:"Mosebetsi le phihlelo",btn_add:"Kenya",btn_cancel:"Hlakola",btn_close:"Koala",
 notif_fix:"Lokisa", notif_ok:"Ha ho letho le haellang. E hatise kapa e boloke e le PDF.",
 
 
 
 
 
 
 
 m_empty:"Ha ho letho hajoale. Kenya mola oa hao oa pele ka holimo — esita le thekiso ea R35.",
 m_lines:"mela", m_whatph:"li-kota tse 3 sebakeng sa tekesi",
 
 
 
 i_matcher2:"E hlophisitsoe ho latela chelete ea hao, lipalangwang, sebaka, nako le seo u ratang ho se etsa.",
 i_prices:"Fetola tsena e be lipalo tsa hao tsa 'nete. Ena ke karolo eo batho ba bangata ba e tlolang — 'me ke eona feela ea bohlokoa.",
 cv_howto:"Sena ke sona se hatisoang hantle. Khetha ntho e sieang ka holimo ho e lokisa, kapa u e hatise lebenkeleng ka R2.",
 cv_howto_ok:"Sena ke sona se hatisoang hantle. E hatise lebenkeleng ka R2, kapa khetha Boloka e le PDF.",
 what_translated:"Menus, likonopo, mabitso a masimo le liteko tsa CV li fetoletsoe ka letsoho. Litlhaloso tse ling tse telele li ntse li le Senyesemanteng.",
 inline_note:"Litlhaloso tse telele likareteng tsena li ntse li le Senyesemanteng hajoale.",
 cv_still:"masimo a ntse a haella",
 b_intro:"Kenyelletso e khuts'oane",b_intro_d:"Serapa se le seng sa WhatsApp kapa imeile",
 b_cv:"Kakaretso ea CV",b_cv_d:"E manehe fomong ea kopo ea inthaneteng",
 b_pitch:"Tlhaloso ea khoebo",b_pitch_d:"Bakeng sa motšehetsi, moeletsi kapa molekane",
 b_fund:"Mabaka a kopo ea chelete",b_fund_d:"Bakeng sa NYDA, SEFA kapa motšehetsi",
 btn_copy:"Kopisa",b_edit:"e lokise pele u e romela",p_nblocks:"dikarolo",
 btn_copyshort:"Kopisa sena",btn_copied:"E kopisitsoe",btn_selected:"E khethiloe",
 toast_copied:"E kopisitsoe — e manehe kae kapa kae",toast_blocked:"Kopi e thibetsoe ke sebatli sena — mongolo o khethiloe, tobetsa Ctrl+C kapa tšoara nako e telele",
 d1:"Khopi e netefalitsoeng ea ID ea ka (e seng ea khale ho feta likhoeli tse 3)",d2:"Setifikeiti sa mantlha sa matric kapa setatemente sa liphetho",
 d3:"Bopaki ba aterese (lengolo le tsoang ho khanselara, kapa bile e lebitsong la hao)",d4:"Lengolo la netefatso ea banka (le nka mahala lekaleng la hao la banka)",
 d5:"Nomoro ea lekhetho kapa ngoliso ea SARS (bakeng sa khoebo kapa mosebetsi oa molao feela)",d6:"CV — leqephe le 1, e ngotsoeng ka mochini (sebelisa tab ea Pakete)",
 d7:"Batho ba babeli bao u ka buang le bona ba nang le linomoro tsa mohala",d8:"Tumello ea sepolesa (ha feela mosebetsi o e kopa — hoo e ka bang R150 SAPS)",
 d9:"Likhopi tse netefalitsoeng tsa mangolo a thuto",d10:"Setšoantšo sa hao sa morao-rao (li-learnership tse ling lia se kopa)",
 id_hint:"Re hlahloba dinomoro tse 13. Ha ho se tswang foneng ena.",
 id_unchecked:"ID ha e so hlahloboe", id_valid:"ID e nepahetse", id_ok:"Nomoro ea ID e nepahetse. O hlahile",
 id_ph:"linomoro tse 13", id_check:"E hlahlobe", id_bad:"Sena ha se tsamaellane hajoale —", id_bad_digit:"nomoro e le 'ngoe e fosahetse.", id_bad_date:"hlahloba karolo ea letsatsi.",
 lrn_title:"Ha o so e etse? Ithute mahala",lrn_zero:"Qala ho tloha ho zero",
 lrn_skills:"Seo u lokelang ho khona ho se etsa",lrn_practise:"Itloaetse hae bekeng ena — mahala",
 lrn_where:"Moo u ka ithutang teng",lrn_zero_rated:"Ha e je data",lrn_data:"E hloka data",
 lrn_video:"Video",lrn_photos:"Tataiso ea ditshwantsho",lrn_course:"Thuto",
 lrn_note:"Tsena li bula webosaete — sesebelisoa sona se ntse se sebetsa ntle le inthanete. Shebella livideo ka WiFi kapa ka night bundle, 'me u latele mokhoa o le mong hantle pele u iqapela oa hao.",
 lrn_start_title:"HA O NA BOKGONI? QALA MONA",
 lrn_method:"Mokhoa oa ho ithuta eng kapa eng ntle le chelete",lrn_free_sa:"Mahala Afrika Boroa",lrn_free_world:"Lithuto le litataiso tsa mahala",
 
 cat_zero:"Ha ho bokgoni",
 lock_protect_title:"Sireletsa polokelo ya hao",lock_unlock_title:"Kenya PIN ya hao",lock_lock_title:"Ho notlela polokelo",
 lock_set_help:"PIN ya dinomoro tse 6–8 e pata dintlha tsa hao fonong ena. Kaha faele kaofela e ka kopiswa e be e hlaselwa kantle, Pusha e hana di-PIN tse kgutshwane mme e sebedisa nako e ngata ho hakanya. Ha ho tsela ya ho e lebala — ha o e lebala, dintlha di ke ke tsa fumaneha.",
 lock_unlock_help:"Dintlha tsa hao di patilwe fonong ena.",lock_pin_label:"PIN e ntjha (dinomoro tse 6–8)",lock_pin_short:"PIN",
 lock_locked_note:"Polokelo ya hao e notletswe. Dintlha tsa hao di patilwe fonong ena.",
 btn_setpin:"Bea PIN",btn_savepin:"Bea PIN, pata data",btn_locknow:"Notlela jwale",btn_changepin:"Fetola PIN",btn_rmpin:"Tlosa PIN",btn_unlock:"Bula",
 btn_unlock_to_edit:"Bula ho fetola",btn_yes_remove:"Ee, e tlose",
 pin_weak:"E fokola — ho bonolo ho e hakanya",pin_fair:"E lokile",pin_strong:"E matla",pin_digits:"Dinomoro feela",
 pin_why:"PIN e kgutshwane ke yona bothata — nomoro e nngwe le e nngwe e thatafatsa hakanya ka makgetlo a leshome.",pin_guess:"≈ %s ho hakanya",pin_too_weak:"Ho bonolo ho e hakanya — qoba tatellano le ho pheta",
 u_year:"selemo",u_years:"dilemo",u_month:"kgwedi",u_months:"dikgwedi",u_day:"letsatsi",u_days:"matsatsi",
 u_hour:"hora",u_hours:"dihora",u_min:"motsotso",u_mins:"metsotso",u_sec:"motsotsoana",u_secs:"metsotsoana",
 pin_wait:"O lekile hangata. Ema metsotsoana e %s.",
 lock_rm_confirm:"Tlosa PIN? Dintlha tsa hao di sala fonong ena, empa di ke ke tsa hlola di patwa.",
 toast_pin_short:"Sebedisa dinomoro tse 6 kapa ho feta",toast_pin_short_unlock:"Sebedisa dinomoro tse 4 kapa ho feta",toast_pin_bad:"PIN e fosahetse",toast_unlocked:"E butswitse",
 toast_locked:"E notletswe — dintlha tsa hao di patilwe fonong ena",
 toast_pin_set:"PIN e behilwe — dintlha tsa hao di se di patilwe fonong ena",
 toast_pin_removed:"PIN e tlositswe — dintlha tsa hao ha di sa patwa",
 store_full:"Sebaka se tletse — phetoho ya hao ya ho qetela ha ya bolokwa.",
 bk_note:"Dintlha le difaele tsa hao di bolokwa fonong ena. Faele ya kopi ke yona feela tsela ya ho di isa fonong e ntjha kapa ho di kgutlisa ha data ya sebatli e hlakotswe.",
 store_help:"Boloka kopi, ebe o tlosa setshwantsho kapa mela ya buka ya chelete ho etsa sebaka.",
 toast_saved:"E bolokilwe fonong ena",toast_nosave:"Ha ea bolokwa — sebaka se tletse",
 toast_save_failed:"Ha ea bolokwa — leka hape",toast_restored:"E buseditswe",
 toast_unlock_first:"Bula polokelo pele",toast_not_image:"Seo ha se setshwantsho",
 toast_photo_bad:"Ha re a kgona ho bala setshwantsho",toast_photo_added:"Setshwantsho se kentswe — se ho CV ya hao jwale",
 toast_photo_removed:"Setshwantsho se tlositswe",toast_print_blocked:"Jarolla faele ebe o e bula sebatling ho hatisa",
 toast_price_first:"Kenya theko ya hao pele",toast_name_first:"Reha mohopolo wa hao lebitso pele",
 toast_deleted:"E tlositswe",toast_error:"Ho na le ho sa tsamayang hantle — data ya hao e bolokehile",
 toast_amount_first:"Kenya chelete pele",toast_cash_added:"E kentswe bukeng ya chelete",
 toast_locked_in:"Ho tiisitswe",btn_undo:"Busetsa",btn_share:"Arolelana",
 btn_rmphoto:"Tlosa setshwantsho",se_ph:"Batla mehopolo — ngola lentsoe",se_none:"Ha ho se lumellanang",
 bk_title:"Kopi",btn_bk_save:"Boloka faele ya kopi",btn_bk_load:"Kenya kopi",
 bk_done:"Kopi e jarollotswe",bk_loaded:"Kopi e kentswe",bk_bad:"Faele ena ha se kopi ya Pusha",bk_too_large:"Kopi ena e kgolo haholo hore e ka romelwa fonong ena.",
 bk_confirm:"Kenya kopi sebakeng sa tsohle fonong ena?",
 bk_enc_note:"Kopi ya hao e boloka ho pata ha PIN — ntle le PIN polokelo e ka hare e ke ke ya bulwa.",
 bk_plain_note:"Kopi ena ha e a patwa. Mang kapa mang ya bulang faele a ka bala dintlha tsa hao.",
 cv_pdf_hint:"Fonong: tobetsa Print ebe o kgetha “Save as PDF”.",
 fresh:"Ditheko: November 2026 — netefatsa pele o reka.",
 al_title:"Ho notlela ka boiketsetso",al_off:"Ho timilwe",al_1:"Kamora motsotso o 1",al_5:"Kamora metsotso e 5",al_15:"Kamora metsotso e 15",
 fb_title:"Re bolelle se fositseng",fb_btn:"Kopisa tlaleho",fb_copied:"E kopisitswe — e kgomarelle ho SMS kapa imeile.",
 fb_help:"Kopisa tlaleho, kapa e romele ka ho toba ho rona. Ha ho se romelwang ka boiketsetso.",
 btn_export:"Kopisa buka ya ka ya chelete",btn_delline:"Tlosa mola ona",

ct_title:"O bone phoso? Re bolelle",ct_call:"Letsa kapa romela SMS",ct_mail:"Imeile",ct_note:"Ho lokolohile ho romela molaetsa. Ha ho se romelwang ntle le ha o tobetsa.",fb_send_email:"E romele ka imeile",ct_wa_note:"Re romele molaetsa — mahala",fb_send_wa:"Romela ka WhatsApp",ios_title:"Boloka sena ho iPhone ya hao",ios_body:"iPhone e hlakola dintlha tse bolokilweng tsa webosaete ka mora matsatsi a 7 ntle le ho e etela. Skrineng sa hae ha e etse jwalo.",ios_step1:"Tobetsa Share ka tlase ho Safari.",ios_step2:"Kgetha “Add to Home Screen”, ebe o bula Pusha ho ikhone e ntjha.",ios_ok:"Ke utlwile",ios_backup:"Boloka backup",ios_later:"E seng jwale"},
nr:{
 pdf_add_vault:"Faka okuvela kuVault",pdf_vault_empty:"Akunama-PDF agcinwe kuVault.",pdf_vault_choose:"Khetha i-PDF egciniweko:",
 pdf_title:"Hlanganisa i-CV nama-PDF",pdf_card_hint:"Faka i-CV nama-PDF, hlela amakhasi bese ugcina i-PDF eyodwa.",pdf_open:"Yenza iphakethe le-PDF",pdf_add_cv:"Faka i-CV yami yePusha",pdf_add_files:"Faka amafayela we-PDF",pdf_order:"Ukuhleleka kwamakhasi",pdf_empty:"Akunamakhasi. Faka i-CV namkha i-PDF.",pdf_up:"Yisa phezulu",pdf_down:"Yisa phasi",pdf_remove:"Susa",pdf_save:"Dawuniloda i-PDF",pdf_close:"Vala",pdf_busy:"Kusalungiswa efonini le…",pdf_privacy:"Amafayela asetjenzwa efonini le, awathunyelwa. I-PDF elandiweko ayivikelwa nge-PIN. I-CV ifakwa njengesithombe.",pdf_limits:"Ifayela ngalinye: 10 MB; koke: 25 MB namakhasi 100. Ama-PDF anephasiwedi awasebenzi. Amasiginitjha neenkambu zamaforomo kungenzeka zingagcinwa.",pdf_bad:"I-PDF le ayivuleki. Kungenzeka yonakele namkha inephasiwedi.",pdf_large:"I-PDF le ingaphezu kwe-10 MB.",pdf_limit:"Umkhawulo yi-25 MB namakhasi 100.",pdf_error:"I-PDF ayenziwanga. Linga godu.",pdf_cv:"I-CV yePusha",pdf_page:"ikhasi",pdf_ready:"Amakhasi alungile",pdf_no_pages:"Faka ikhasi elilodwa okungani.",pdf_cv_added:"I-CV yakho seyikhona.",pdf_cv_long:"I-CV yinde khulu. Yifinyeze ulinge godu.",pdf_done:"I-PDF ilungile. Yihlole ngaphambi kokuyithumela.",
 files_set_pin:"Setha i-PIN ukufaka amafayela",cv_template:"Isifanekiso se-CV",cv_classic:"Sakade",cv_modern:"Sesimanje",cv_simple:"Esilula",
 nav_vault:"Umqulu",nav_pack:"Iphakethe",nav_ideas:"Imibono",nav_money:"Imali",nav_path:"Indlela",
 p_version:"Inguqulo",p_var_help:"Khetha lelo elizwakala njengawe.",
id_chip:"A4 · cishe R2 lapaebrari",docs_chip:"Tshwaya okunawo",
tool_match:"Ngifanise",tool_start:"Qala lapha",tool_mine:"Umqondo wami",tool_make:"Yenza & thengisa",diy_photo_note:"Okwakho kuzobukeka kuhluke kancane — lokho kujayelekile.",
diy_btn:"Ngikhombise izinto ezili-10",diy_title:"Izinto ezili-10 ongazenza begodu uzithengise",diy_lede:"Akunaqeqesho, akunamshini, akunasitudiyo. Khetha eyodwa, thenga uhlu oluncani, begodu wenze ezintathu zokuqala ngaphambi kokusebenzisa enye imali.",diy_note:"Imifanekiso nemiyalelo zihlala ngesiNgisi okwamanje. Amanani ayizilinganiso zangoNovemba 2026 — wahlole esitolo sakho.",diy_cost:"Ukuqala",diy_price:"Ithengiswa",diy_time:"Isikhathi",diy_need:"Okukudingako",diy_need_note:"Amanani awepakethe ephelele, hhayi into ngayinye — inengi lenza iingcezu ezinengi.",diy_steps:"Yenza lokhu, ngokulandelana",diy_sell:"Ngubani othengako",diy_watch:"Okungahamba kabi",diy_safety:"Qaphela",diy_free:"kungokwakho",diy_pic1:"Okukudingako",diy_pic2:"Isinyathelo esikhulu",diy_pic3:"Sekuphelile",diy_copy:"Khopisha uhlu lwezokuthenga",btn_back:"Buyela ohlwini",
grip_title:"Donsa ikhoneko lelo bona ibhokisi libe likhulu",grip_body:"Imigca emincani ekhoneni leli bhokisi yi-isibambo. Yidonsele phasi ngomunwana omunye, ibhokisi liyakhula, bona ubone koke lokho okubhalileko esikhundleni sokuskrola ngaphakathi kwebhokisi elincani. Ibhokisi likhumbula ubukhulu balo, begodu ungathinta ikhoneko godu nanyana nini ukufunda lokhu.",grip_gotit:"Ngizwisisile",grip_aria:"Indlela yokwenza ibhokisi leli libe likhulu",
lock_pin_again:"Bhala i-PIN godu",
 toast_pin_mismatch:"Lawo ma-PIN amabili akafani. Bhala i-PIN efanayo kabili.",
 toast_amount_bad:"Leyo akusiyo imali. Bhala 35 no 35.50.",
 toast_dup_line:"Umugca lowo usuvele ukhona ku-cashbook yakho.",
 bk_replace_title:"Faka konke esikhundleni kule foni?",
 bk_replace_body:"Ikhophi le inezinto ezi-%s ezigciniweyo kusukela %d. Nxa uyifaka, kususwa konke okukule foni nje — imininingwane, i-cashbook, imibono ne-PIN.",
 bk_keep_mine:"Landa idatha yami kuqala",
 bk_replace_go:"Faka nanyana kunjalo",
 warn_email:"Akukho @ kuleli kheli — lihlole ngaphambi kokulithumela.",
 warn_phone:"Lokhu akubonakali njengenombolo yocingo — hlola izinombolo.",
 v_kicker:"Isigaba 1 · umqulu",v_title:"Imininingwana yakho, kanye.",
 
 v_chip1:"Kule foni kuphela",v_chip2:"Akukho i-akhawunti",
 sec_personal:"Okwakho",sec_school:"Isikolo namakghono",sec_bank:"Ibhanga",
 photo_title:"Isithombe sakho",photo_opt:"(ngokuthanda kwakho)",
 photo_hint:"Ku-CV neSheethe yemininingwane.",btn_addphoto:"Faka isithombe",
 files_title:"Amafayela wami",files_add:"Faka amafayela",files_note:"Amafayela ahlala efonini le avikelwe nge-PIN yeVault. Faka i-PIN ngaphambi kokuwafaka.",
 files_unlock:"Vula iVault ukuze ufike kumafayela.",files_pin_first:"Faka begodu uvule i-PIN yeVault ngaphambi kokufaka amafayela.",
 files_loading:"Kulayishwa amafayela…",files_one:"Ifayela elilodwa ligcinwe efonini le.",files_count:"Amafayela ayi-%s agcinwe efonini le.",files_empty:"Akukho mafayela agciniweko.",
 files_download:"Dawuniloda",files_remove:"Susa",files_remove_confirm:"Ususe ifayelali efonini le?",
 files_error:"Amafayela awagcinwanga. Hlola indawo yokugcina efonini le bese uyazama godu.",
 files_decrypt_error:"Ifayelali ayivulekanga. Vula nge-PIN yeVault efaneleko bese uyazama godu.",
 files_too_large:"Ifayelali idlula umkhawulo we-10 MB.",files_limit:"Umkhawulo wamafayela ufinyelelwe (ayi-50 namkha 25 MB woke).",
 files_saving:"Kugcinwa amafayela efonini le…",files_saved:"Amafayela ayi-%s agciniwe efonini le.",
 files_partial:"Amafayela ayi-%s agciniwe; ayi-%d awagcinwanga.",files_keep_pin:"Susa amafayela agciniweko ngaphambi kokususa i-PIN yeVault.",
 lbl_fullname:"Ibizo eliphelele (njengaku-ID)",lbl_id:"Inombolo ye-ID",lbl_dob:"Ilanga lokuzalwa",lbl_gender:"Ubulili",
 lbl_phone:"Ifoni",lbl_email:"I-imeyili",lbl_address:"Ikheli lasekhaya",lbl_kin:"Umuntu ongathintwa",lbl_licence:"Ilayisense yokutjhayela",
 lbl_school:"Isikolo samabanga aphezulu",lbl_year:"Umnyaka kamatric",lbl_examno:"Inombolo yokuhlolwa",
 lbl_subjects:"Izifundo eziphambili",lbl_skills:"Amakghono nezitifiketi",
 lbl_bank:"Ibhanga",lbl_acctype:"Uhlobo lwe-akhawunti",lbl_accno:"Inombolo ye-akhawunti",lbl_branch:"Ikhodi yegatsha",
 btn_save:"Gcina imininingwana yami",
 p_title:"Iphakethe lami",p_blocks:"Amabhulokhi wokukopisha",p_cv:"I-CV yami",p_sheet:"Iphepha lemininingwana",
 btn_print:"Phrinta / PDF",btn_opencv:"Vula i-CV yami",btn_copytext:"Kopisha njengombhalo",p_docs:"Uhlu lwamadokhumende",
 i_title:"Imibono yomrhwebo",
 btn_match:"Ngihlanganisele imibono",btn_addidea:"Faka umbono wami",
 m_title:"Imali",m_today:"Namhlanje",m_week:"Iveke le",m_month:"Inyanga le",m_addline:"Faka umugca",
 m_type:"Uhlobo",m_in:"Imali engenako",m_out:"Imali ephumako",m_amount:"Inani (R)",m_whatfor:"Kwenzelwa ini",
 btn_addcash:"Faka ebukeni yemali",m_7days:"Amalanga a-7 adlulileko",m_goal:"Inhloso yokonga",m_what:"Ini",m_target:"Inhloso (R)",
 pa_title:"Amalanga akho a-7 azako",pa_opps:"Izinto zamahala ongazisebenzisa",pa_scams:"Qaphela ezi",pa_about:"Mayelana nalolu hlelo",
 lang_title:"Ulimi",lang_note:"Yenzelwe iSewula Afrika. I-CV yakho namaphrojekthi womrhwebo kuse-Singisi ukuze umqatjhi, ibhanga namkha umsizi akghone ukuyifunda.",
 cv_ready:"I-CV yakho ilungele ukuthunyelwa",cv_needs:"I-CV yakho idinga izinto ezimbalwa",cv_done:"kwenzekile",
 bt_addsection:"Faka isigaba sakho",cv_print:"Phrinta / Gcina njenge-PDF",
 cv_custom_title:"Faka isigaba",cv_custom_hint:"Nanyana ini i-CV engenayo indawo yayo — umsebenzi, ukuzithandela, impumelelo, izifundo, izilimi.",
 cv_sec_work:"Umsebenzi namava",btn_add:"Faka",btn_cancel:"Buyela",btn_close:"Vala",
 notif_fix:"Lungisa", notif_ok:"Akukho okusilako. Phrinta namkha gcina njenge-PDF.",
 
 
 
 
 
 
 
 m_empty:"Akukho lutho okwanje. Faka umugca wakho wokuqala ngehla — ngisho nokuthengisa nge-R35.",
 m_lines:"imigca", m_whatph:"amakhota a-3 emakethe",
 
 
 
 i_matcher2:"Kuhlelwe ngokwemali yakho, ezokuhamba, indawo, isikhathi nokuthanda kwakho.",
 i_prices:"Tjhentjha lezi zibe yimanani yakho yeqiniso. Le yingcenye abantu abanengi abayekako — futhi iyona kuphela ebalulekileko.",
 cv_howto:"Lokhu yikho okuphrintwako. Khetha into engekho ngehla ukuze uyilungise, namkha uyiphrinte esitolo nge-R2.",
 cv_howto_ok:"Lokhu yikho okuphrintwako. Yiphrinte esitolo nge-R2, namkha khetha Gcina njenge-PDF.",
 what_translated:"Amamenyu, amabhathini, amabizo wemikhakha nokuhlolwa kwe-CV kuhunyushwe ngesandla. Ezinye izincazelo ezinde zise-Singisi.",
 inline_note:"Izincazelo ezinde kula makhadi zise-Singisi okwanje.",
 cv_still:"izinto zisekhona",
 b_intro:"Isethulo esifitjhani",b_intro_d:"Isigaba esisodwa se-WhatsApp namkha i-imeyili",
 b_cv:"Isifingqo se-CV",b_cv_d:"Namathisela efomini lokucela ku-inthanethi",
 b_pitch:"Isethulo somrhwebo",b_pitch_d:"Sabaxhasi, abeluleki namkha abalingani",
 b_fund:"Isizathu socelo lwemali",b_fund_d:"Se-NYDA, i-SEFA namkha umxhasi",
 btn_copy:"Kopisha",b_edit:"hlela ngaphambi kokuthumela",p_nblocks:"amabhulokhi",
 btn_copyshort:"Kopisha lokhu",btn_copied:"Kukopishiwe",btn_selected:"Kukhethiwe",
 toast_copied:"Kukopishiwe — namathisela noma kuphi",toast_blocked:"Ikhopi ivinjelwe yilesi siphequluli — umbhalo ukhethiwe, tinya Ctrl+C namkha bamba isikhathi eside",
 d1:"Ikhophi eqinisekisiweko ye-ID yami (engadluli iinyanga ezi-3)",d2:"Isitifiketi sokuqala samatric namkha isitatimende semiphumela",
 d3:"Ubufakazi bekheli (incwadi evela kukhansela, namkha ibhili egameni lakho)",d4:"Incwadi yokuqinisekisa yebhanga (yithole mahala egatsheni lakho lebhanga)",
 d5:"Inombolo yerhafu namkha ukubhaliswa kwe-SARS (kuphela komrhwebo namkha umsebenzi osemthethweni)",d6:"I-CV — iphepha eli-1, ebhalwe ngekhompyutha (sebenzisa ithebhu yePhakethe)",
 d7:"Abantu ababili ongathintana nabo abanezinombolo zefoni",d8:"Imvume yamaphoyisa (kuphela nangabe umsebenzi uyicela — cishe R150 eSAPS)",
 d9:"Amakhophi aqinisekisiweko weziqu nezitifiketi",d10:"Isithombe sakho sakamuva (amanye ama-learnership ayasidinga)",
 id_hint:"Sihlola iinomoro ezili-13. Akukho okuphumako kulefoni.",
 id_unchecked:"I-ID ayikahlolwa", id_valid:"I-ID ivumelekile", id_ok:"Inombolo ye-ID ivumelekile. Uzalwe",
 id_ph:"amadijithi a-13", id_check:"Hlola", id_bad:"Lokhu akuhambisani njeke —", id_bad_digit:"idijithi eyodwa ayilunganga.", id_bad_date:"hlola ingcenye yelanga.",
 lrn_title:"Awukakabeni? Funda mahala",lrn_zero:"Qala ukusuka ku-zero",
 lrn_skills:"Okuqakathekileko ukukghona ukukwenza",lrn_practise:"Zijwayeze ekhaya iveke le — mahala",
 lrn_where:"Kuphi lapho ongakufunda khona",lrn_zero_rated:"Akudli idatha",lrn_data:"Kudinga idatha",
 lrn_video:"Ividiyo",lrn_photos:"Umhlahlandlela wemifanekiso",lrn_course:"Isifundo",
 lrn_note:"Lezi zivula i-websaete — ihlelo ngokwalo lisebenza ngaphandle kwe-inthanethi. Buka amavideo nge-WiFi namkha nge-night bundle, bese ulandela indlela eyodwa ngqo ngaphambi kokwenza eyakho.",
 lrn_start_title:"AWUKABI NAKGHONO? QALA LAPHA",
 lrn_method:"Indlela yokufunda nanyana ini ngaphandle kwemali",lrn_free_sa:"Mahala eSewula Afrika",lrn_free_world:"Izifundo nemihlahlandlela yamahala",
 
 cat_zero:"Akukho kghono",
 lock_protect_title:"Vikela umqulu wakho",lock_unlock_title:"Faka i-PIN yakho",lock_lock_title:"Ukukhiya umqulu",
 lock_set_help:"I-PIN yamadijithi ama-6–8 ifihla imininingwane yakho kule foni. Ngoba lifayela loke lingakopishwa lihlaselwe ngaphandle, i-Pusha iyala ama-PIN amafitjhane begodu isebenzisa isikhathi esinengi ekuguqeleni. Akukho okokuyikhohlwa — nangabe uyikhohlwa, imininingwane ayikghoni ukubuyiswa.",
 lock_unlock_help:"Imininingwane yakho ifihliwe kule foni.",lock_pin_label:"I-PIN entjha (amadijithi ama-6–8)",lock_pin_short:"I-PIN",
 lock_locked_note:"Umqulu wakho ukhiyiwe. Imininingwane yakho ifihliwe kule foni.",
 btn_setpin:"Beka i-PIN",btn_savepin:"Beka i-PIN bese ufihla",btn_locknow:"Khiya nje",btn_changepin:"Tjhugulula i-PIN",btn_rmpin:"Susa i-PIN",btn_unlock:"Vula",
 btn_unlock_to_edit:"Vula ukuze uhlele",btn_yes_remove:"Yebo, yisuse",
 pin_weak:"Ibuthakathaka — kulula ukuyiqagela",pin_fair:"Ilungile",pin_strong:"Iqinile",pin_digits:"Amadijithi kwaphela",
 pin_why:"I-PIN emfitjhane ilula ukuyiqagela — idijithi ngayinye yenza kube nzima khulu.",pin_guess:"≈ %s ukuqagela",pin_too_weak:"Kulula ukuyiqagela — gwema ukulandelana nokuphinda",
 u_year:"umnyaka",u_years:"iminyaka",u_month:"inyanga",u_months:"iinyanga",u_day:"ilanga",u_days:"amalanga",
 u_hour:"ihora",u_hours:"amahora",u_min:"umzuzu",u_mins:"imizuzu",u_sec:"umzuzwana",u_secs:"imizuzwana",
 pin_wait:"Uzame kaningi. Linda imizuzwana engu-%s.",
 lock_rm_confirm:"Susa i-PIN? Imininingwane yakho isahlala kule foni, kodwa ayisazofihlwa.",
 toast_pin_short:"Sebenzisa amadijithi ama-6 nangaphezulu",toast_pin_short_unlock:"Sebenzisa amadijithi ama-4 nangaphezulu",toast_pin_bad:"I-PIN ayilunganga",toast_unlocked:"Kuvuliwe",
 toast_locked:"Kukhiyiwe — imininingwane yakho ifihliwe kule foni",
 toast_pin_set:"I-PIN ibekiwe — imininingwane yakho isifihliwe kule foni",
 toast_pin_removed:"I-PIN isusiwe — imininingwane yakho ayisafihliwe",
 store_full:"Indawo igcwele — ukutjhuguluka kwakho kokugcina akukagcinwa.",
 bk_note:"Imininingwana namafayela wakho kugcinwa efonini le. Ikhopi ngiyo yodwa indlela yokuwasa efonini etjha namkha ukuwabuyisa ngemva kokusula idatha yesiphequluli.",
 store_help:"Gcina ikhopi, bese ususa isithombe namkha imigca yencwadi yemali ukuze kube nendawo.",
 toast_saved:"Kugcinwe kule foni",toast_nosave:"Akukugcinwanga — indawo igcwele",
 toast_save_failed:"Akukgcinwanga — zama godu",toast_restored:"Kubuyisiwe",
 toast_unlock_first:"Vula umqulu kuqala",toast_not_image:"Lokho akusikho isithombe",
 toast_photo_bad:"Asikghonanga ukufunda isithombe",toast_photo_added:"Isithombe sengeziwe — sise-CV yakho nje",
 toast_photo_removed:"Isithombe sisusiwe",toast_print_blocked:"Landa ifayela bese ulivula kusiphequluli ukuze uprinte",
 toast_price_first:"Faka intengo yakho kuqala",toast_name_first:"Biza umqondo wakho ibizo kuqala",
 toast_deleted:"Kususiwe",toast_error:"Kukhona okungahambanga kahle — idatha yakho iphephile",
 toast_amount_first:"Faka isamba kuqala",toast_cash_added:"Kungezwe encwadini yemali",
 toast_locked_in:"Kuqinisekisiwe",btn_undo:"Buyisela",btn_share:"Yabelana",
 btn_rmphoto:"Susa isithombe",se_ph:"Sesha imibono — bhala ibizo",se_none:"Akukho okuhambelanako",
 bk_title:"Ikhopi",btn_bk_save:"Gcina ifayela lekhopi",btn_bk_load:"Layisha ikhopi",
 bk_done:"Ikhopi ilandiwe",bk_loaded:"Ikhopi ilayishiwe",bk_bad:"Leli fayela akulikho ikhopi le-Pusha",bk_too_large:"Ikhopi le yikulu khulu bona ingakhitjhelwa efonini le.",
 bk_confirm:"Faka ikhopi esikhundleni sakho konke kule foni?",
 bk_enc_note:"Ikhopi yakho igcina ukufihlwa kwe-PIN — ngaphandle kwe-PIN umqulu ngaphakathi awukghoni ukuvulwa.",
 bk_plain_note:"Le khopi ayifihliwe. Nanyana ngubani ovula ifayela angafunda imininingwane yakho.",
 cv_pdf_hint:"Kufoni: tinya i-Print bese ukhetha i-“Save as PDF”.",
 fresh:"Iintengo: Novemba 2026 — qinisekisa ngaphambi kokuthenga.",
 al_title:"Ukukhiya ngokuzenzakalela",al_off:"Kucishiwe",al_1:"Ngemva komzuzu o-1",al_5:"Ngemva kwemizuzu e-5",al_15:"Ngemva kwemizuzu e-15",
 fb_title:"Sitshele okungahambanga kahle",fb_btn:"Khopisha umbiko",fb_copied:"Kukopisisiwe — kufaka ku-SMS namkha ku-imeyili.",
 fb_help:"Khopisha umbiko, namkha uwuthumele ngqo kithi. Akukho okuthunyelwako ngokuzenzakalelako.",
 btn_export:"Khopisha incwadi yami yemali",btn_delline:"Susa lo mugca",

ct_title:"Ubonile iphoso? Sitjhele",ct_call:"Rhetha namkha thumela i-SMS",ct_mail:"I-imeyili",ct_note:"Kumahala ukuthumela umlayezo. Akukho okuthunyelwako ngaphandle kwapho ucindeta.",fb_send_email:"Yithumele nge-imeyili",ct_wa_note:"Sithumelele umlayezo — kumahala",fb_send_wa:"Thumela nge-WhatsApp",ios_title:"Bulungela lokhu ku-iPhone yakho",ios_body:"I-iPhone isusa imininingwane egciniweko yewebhusayithi ngemva kwamalanga ali-7 ngaphandle kokuvakatjha. Esikrinini sasekhaya akenzi njalo.",ios_step1:"Tinya i-Share ngezasi kwe-Safari.",ios_step2:"Khetha “Add to Home Screen”, bese uvula i-Pusha kusithonjana esitsha.",ios_ok:"Ngizwile",ios_backup:"Bulungela ikhophi",ios_later:"Hayi nje"}
};let LANG = Store.get("pusha_lang", "en");
const t = k => (I18N[LANG] && I18N[LANG][k] != null) ? I18N[LANG][k] : (I18N.en[k] != null ? I18N.en[k] : k);

function renderIdInfo(){
  const box = $("#idInfo"), pill = $("#idPill"), id = $("#f_id").value;
  const r = checkSAID(id);
  if (!id) { box.textContent = t("id_hint"); pill.innerHTML = t("id_unchecked"); pill.className = "pill grey"; return; }
  if (r.ok){
    box.innerHTML = '<span style="color:var(--ok)">' + ico("check","sm") + '</span> ' + t("id_ok") + ' <b>' + r.dob + '</b>, ' + r.gender.toLowerCase() + ", " + r.citizen + ".";
    pill.innerHTML = ico("check","sm") + " " + t("id_valid"); pill.className = "pill";
    if (!$("#f_dob").value) $("#f_dob").value = r.dob;
    if (!$("#f_gender").value) $("#f_gender").value = r.gender;
  } else {
    box.innerHTML = '<span style="color:var(--accent)">' + ico("alert","sm") + '</span> ' + t("id_bad") + ' ' + (r.checksumOK === false ? t("id_bad_digit") : t("id_bad_date"));
    pill.innerHTML = ico("alert","sm") + " " + t("id_check"); pill.className = "pill amber";
  }
}

/* gentle, non-blocking check on the two details people mistype most.
   It never stops a save: it says what looks odd and lets them decide. */
function renderContactHint(){
  const box = $("#contactHint"); if (!box) return;
  const mail = ($("#f_email") || {}).value || "";
  const phone = ($("#f_phone") || {}).value || "";
  const mailBad = !!mail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.trim());
  const digits = phone.replace(/\D/g, "");
  const phoneBad = !!phone.trim() && (/[A-Za-z]/.test(phone) || digits.length < 9 || digits.length > 15);
  box.textContent = mailBad ? t("warn_email") : phoneBad ? t("warn_phone") : "";
  box.style.display = box.textContent ? "block" : "none";
}

/* subjects: every word · skills & certificates: first word of each comma item */
function tidyVaultText(writeBack){
  ["subjects", "skills"].forEach(k => {
    const mode = k === "subjects" ? "every" : "first";
    const clean = tidyText(vault[k], mode);
    if (clean !== vault[k]){
      vault[k] = clean;
      const el = $("#f_" + k);
      if (writeBack && el && el.value !== clean) el.value = clean;
    } else if (vault[k] == null){
      vault[k] = "";
    }
  });
}
function fillVault(){
  tidyVaultText(true);
  VAULT_FIELDS.forEach(k => { const el = $("#f_" + k); if (el && vault[k] != null) el.value = vault[k]; });
  renderIdInfo();
}
let saveT;
/* one write path for the vault. Resolves true only if the bytes really landed. */
function persistVault(){
  const write = blob => {
    const ok = Store.set("pusha_vault", blob);
    if (ok) clearStorageFail(); else storageFail();
    return ok;
  };
  // If a PIN is set, every save re-encrypts with the key already in memory.
  // Without this the first autosave after unlocking writes plain text and the PIN is silently gone.
  if (vaultPin && typeof enc === "object" && enc.encryptWith){
    return enc.encryptWith(vaultPin, vault).then(write)
      .catch(() => { toast(t("toast_save_failed")); return false; });
  }
  return Promise.resolve(write(vault));
}
function saveVault(silent, normalizeText){
  if (locked) return;
  VAULT_FIELDS.forEach(k => { const el = $("#f_" + k); if (el) vault[k] = el.value; });
  if (normalizeText !== false) tidyVaultText(true);
  persistVault().then(ok => { if (!silent) toast(ok ? t("toast_saved") : t("toast_nosave")); });
  if (typeof renderCVThumb === "function") renderCVThumb();
  // renderCVBanner() uses the language dictionary, which is not initialised yet during first paint
  try { renderCVBanner(); } catch(e){}
}
function setLockedUI(){
  VAULT_FIELDS.forEach(k => { const el = $("#f_" + k); if (el) el.disabled = locked; });
  $("#saveVault").disabled = locked;
  const pi = $("#photoIn"); if (pi) pi.disabled = locked;
  if (typeof setDocumentsLocked === "function") setDocumentsLocked(locked);
  $("#saveVault").textContent = locked ? t("btn_unlock_to_edit") : "Save my details";
  $("#lockGate").innerHTML = locked
    ? '<div class="banner ok">' + '<span>' + ico("lock","sm") + '</span><span><b>' + t("lock_locked_note") + '</b><button class="btn sm" id="gateUnlock" style="margin:8px 0 0">' + t("btn_unlock") + '</button></span></div>'
    : "";
  if (locked) $("#gateUnlock").addEventListener("click", () => lockSheet("unlock"));
}
function renderAvatar(){
  const a = $("#avatar"); if (!a) return;
  a.innerHTML = vault.photo
    ? '<img alt="Your photo" src="' + vault.photo + '">'
    : '<svg class="icon lg" style="width:26px;height:26px"><use href="#i-user"/></svg>';
  const rm = $("#photoRm"); if (rm) rm.style.display = (!vault.photo || locked) ? "none" : "inline-flex";
}
(function(){
  const input = $("#photoIn"); if (!input) return;
  input.addEventListener("change", e => {
    if (locked) return toast(t("toast_unlock_first"));
    const f = e.target.files && e.target.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) return toast(t("toast_not_image"));
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 300, c = document.createElement("canvas");
        c.width = S; c.height = S;
        const ctx = c.getContext("2d");
        const m = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        let d;
        try { d = c.toDataURL("image/jpeg", 0.82); } catch(err){ return toast(t("toast_photo_bad")); }
        vault.photo = d; saveVault(true); renderAvatar(); renderCVThumb(); toast(t("toast_photo_added"));
      };
      img.onerror = () => toast(t("toast_photo_bad"));
      img.src = fr.result;
    };
    fr.readAsDataURL(f);
    input.value = "";
  });

  const rm = $("#photoRm");
  if (rm) rm.addEventListener("click", () => {
    if (locked) return toast(t("toast_unlock_first"));
    if (!vault.photo) return;
    delete vault.photo;
    saveVault(true); renderAvatar(); renderCVThumb();
    try { renderCVBanner(); } catch(e){}
    toast(t("toast_photo_removed"));
  });
})();
VAULT_FIELDS.forEach(k => {
  const el = $("#f_" + k); if (!el) return;
  el.addEventListener("input", () => { clearTimeout(saveT); saveT = setTimeout(() => saveVault(true, false), 500); });
  el.addEventListener("change", () => {
    if (k === "subjects" || k === "skills"){
      const clean = tidyText(el.value, k === "subjects" ? "every" : "first");
      if (clean !== el.value){ el.value = clean; }
    }
    saveVault(true);
  });
});
$("#f_id").addEventListener("input", renderIdInfo);
["f_phone","f_email"].forEach(id => { const el = $("#" + id); if (el) el.addEventListener("input", renderContactHint); });
renderContactHint();
$("#saveVault").addEventListener("click", () => { saveVault(false); show("pack"); });
fillVault();
setLockedUI();
renderAvatar();
