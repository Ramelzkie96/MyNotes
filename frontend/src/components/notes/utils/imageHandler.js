export function addImageFromFilePicker(editor) {

  if (!editor) {
    return;
  }


  /* ------------------------------------------------------- */
  /* Create file input */
  /* ------------------------------------------------------- */

  const input =
    document.createElement("input");


  input.type = "file";

  input.accept = "image/*";


  /* ------------------------------------------------------- */
  /* Image selected */
  /* ------------------------------------------------------- */

  input.onchange = (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    /* --------------------------------------------------- */
    /* Read image */
    /* --------------------------------------------------- */

    const reader =
      new FileReader();


    reader.onload = () => {

      const src =
        reader.result;


      /* ----------------------------------------------- */
      /* Insert image */
      /* ----------------------------------------------- */

      editor
        .chain()
        .focus()
        .setImage({
          src,
        })
        .run();
    };


    reader.readAsDataURL(file);
  };


  /* ------------------------------------------------------- */
  /* Open file manager */
  /* ------------------------------------------------------- */

  input.click();
}