import { common, createLowlight } from "lowlight";


/* ========================================================= */
/* Lowlight */
/* ========================================================= */

const lowlight = createLowlight(common);


/* ========================================================= */
/* Detect Programming Language */
/* ========================================================= */

export function detectLanguage(text) {

  if (!text || text.trim().length < 5) {
    return null;
  }


  /* ------------------------------------------------------- */
  /* Automatic language detection */
  /* ------------------------------------------------------- */

  const result = lowlight.highlightAuto(text);


  if (!result || !result.data) {
    return null;
  }


  const language = result.data.language;


  if (!language) {
    return null;
  }


  /* ------------------------------------------------------- */
  /* Code patterns */
  /* ------------------------------------------------------- */

  const codePatterns = [

    /[{};]/,

    /\b(const|let|var|function|return|import|export|console)\b/,

    /\b(if|else|for|while|switch|case)\b/,

    /\b(class|interface|extends|implements)\b/,

    /=>/,

    /console\./,

    /\bSELECT\b/i,

    /\bFROM\b/i,

    /\bWHERE\b/i,

    /\bINSERT INTO\b/i,

    /\bUPDATE\b/i,

    /\bDELETE FROM\b/i,

    /<\/?[a-z][\s\S]*>/i,

    /#include\s*</,

    /\bpublic\s+(static\s+)?(class|void|int|string)\b/i,

    /\bdef\s+\w+\s*\(/,

    /:\s*(string|number|boolean|int|float)\b/,
  ];


  /* ------------------------------------------------------- */
  /* Check whether it actually looks like code */
  /* ------------------------------------------------------- */

  const looksLikeCode =
    codePatterns.some((pattern) =>
      pattern.test(text)
    );


  if (!looksLikeCode) {
    return null;
  }


  return language;
}


/* ========================================================= */
/* Paste Handler */
/* ========================================================= */

export function handleEditorPaste(
  editor,
  event,
  detectLanguageFunction
) {

  const clipboardData =
    event.clipboardData;


  if (!clipboardData) {
    return false;
  }


  /* ======================================================= */
  /* IMAGE PASTE */
  /* ======================================================= */

  const imageItems =
    Array.from(
      clipboardData.items || []
    ).filter((item) =>
      item.type.startsWith("image/")
    );


  if (imageItems.length > 0) {

    const imageItem =
      imageItems[0];


    const file =
      imageItem.getAsFile();


    if (file) {

      const reader =
        new FileReader();


      reader.onload = () => {

        const src =
          reader.result;


        editor
          ?.chain()
          .focus()
          .setImage({
            src,
          })
          .run();
      };


      reader.readAsDataURL(file);


      return true;
    }
  }


  /* ======================================================= */
  /* TEXT PASTE */
  /* ======================================================= */

  const text =
    clipboardData.getData(
      "text/plain"
    );


  if (!text) {
    return false;
  }


  /* ======================================================= */
  /* LANGUAGE DETECTION */
  /* ======================================================= */

  const language =
    detectLanguageFunction(text);


  /*
   * Normal text.
   *
   * Let Tiptap handle it normally.
   */

  if (!language) {
    return false;
  }


  /* ======================================================= */
  /* INSERT CODE BLOCK */
  /* ======================================================= */

  editor
    ?.chain()
    .focus()
    .toggleCodeBlock()
    .updateAttributes(
      "codeBlock",
      {
        language,
      }
    )
    .insertContent(text)
    .run();


  return true;
}