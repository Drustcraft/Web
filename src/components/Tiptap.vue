<template>
  <div v-if="editor" class="tiptap">
    <div class="toolbar">
      <button
        @click.prevent="editor.chain().focus().toggleBold().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('bold'),
        }"
      >
        <i class="fas fa-bold"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().toggleItalic().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('italic'),
        }"
      >
        <i class="fas fa-italic"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().toggleUnderline().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('underline'),
        }"
      >
        <i class="fas fa-underline"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().toggleStrike().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('strike'),
        }"
      >
        <i class="fas fa-strikethrough"></i>
      </button>
      <button
        @click.prevent="showColorPicker($event)"
        class="toolbar-button dropdown font-colour"
      >
        <i class="fas fa-font"></i>
        <div class="dropdown-content colour-picker" style="display: none">
          <div class="row">
            <button
              class="colour-remove"
              @click.prevent="editor.chain().focus().unsetColor().run()"
            >
              <i class="fas fa-eraser"></i> Remove Colour
            </button>
          </div>
          <div class="row">
            <button
              v-for="colour in colours"
              :key="colour"
              :class="{
                colour: true,
                'is-active': editor.isActive('textStyle', { color: colour }),
              }"
              @click.prevent="editor.chain().focus().setColor(colour).run()"
            >
              <div :style="'background-color:' + colour"></div>
            </button>
          </div>
        </div>
      </button>
      <!-- <button @click.prevent="editor.chain().focus().toggleCode().run()" :class="{ 'toolbar-button': true, 'is-active': editor.isActive('code') }">
        <i class="fas fa-code"></i>
      </button> -->
      <!-- <button @click.prevent="editor.chain().focus().toggleHighlight().run()" :class="{ 'toolbar-button': true, 'is-active': editor.isActive('highlight') }">
        <i class="fas fa-highlighter"></i>
      </button> -->
      <button
        @click.prevent="editor.chain().focus().clearNodes().run()"
        class="toolbar-button"
      >
        <i class="fas fa-remove-format"></i>
      </button>
      <!-- <button @click.prevent="editor.chain().focus().setParagraph().run()" :class="{ 'toolbar-button': true, 'is-active': editor.isActive('paragraph') }">
        <i class="fas fa-paragraph"></i>
      </button> -->
      <button
        @click.prevent="
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        "
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('heading', { level: 1 }),
        }"
      >
        <i class="fas fa-h1"></i>
      </button>
      <button
        @click.prevent="
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        "
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('heading', { level: 2 }),
        }"
      >
        <i class="fas fa-h2"></i>
      </button>
      <button
        @click.prevent="
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        "
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('heading', { level: 3 }),
        }"
      >
        <i class="fas fa-h3"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().toggleBulletList().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('bulletList'),
        }"
      >
        <i class="fas fa-list-ul"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().toggleOrderedList().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('orderedList'),
        }"
      >
        <i class="fas fa-list-ol"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().toggleCodeBlock().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('codeBlock'),
        }"
      >
        <i class="fas fa-file-code"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().toggleBlockquote().run()"
        :class="{
          'toolbar-button': true,
          'is-active': editor.isActive('blockquote'),
        }"
      >
        <i class="fas fa-quote-left"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().setHorizontalRule().run()"
        class="toolbar-button"
      >
        <i class="fas fa-horizontal-rule"></i>
      </button>
      <!-- <button @click.prevent="editor.chain().focus().setHardBreak().run()" class="toolbar-button">
        hard break
      </button> -->
      <button
        @click.prevent="editor.chain().focus().undo().run()"
        class="toolbar-button"
      >
        <i class="fas fa-undo"></i>
      </button>
      <button
        @click.prevent="editor.chain().focus().redo().run()"
        class="toolbar-button"
      >
        <i class="fas fa-redo"></i>
      </button>
      <button @click.prevent="addImage" class="toolbar-button">
        <i class="fas fa-image"></i>
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import fileDialog from "file-dialog";
import { Editor, EditorContent } from "@tiptap/vue-2";
import { generateHTML } from "@tiptap/html";
import api from "@/api.js";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import History from "@tiptap/extension-history";
import Typography from "@tiptap/extension-typography";
import Hardbreak from "@tiptap/extension-hard-break";
import Placeholder from "@tiptap/extension-placeholder";

// import Dropcursor from '@tiptap/extension-dropcursor';

const Color = TextStyle.extend({
  defaultOptions: {
    types: ["textStyle"],
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.color) {
                return {};
              }

              return {
                style: `color: ${attributes.color}`,
              };
            },
            parseHTML: (element) => ({
              color: element.style.color || null,
            }),
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setColor:
        (color) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { color: color }).run();
        },
      unsetColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { color: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

export function toHTML(str) {
  try {
    let json = JSON.parse(str);
    return generateHTML(json, [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      Heading,
      TextStyle,
      FontFamily,
      Image,
      ListItem,
      BulletList,
      OrderedList,
      CodeBlock,
      Blockquote,
      HorizontalRule,
      History,
      Typography,
      Hardbreak,
      Color,
      // Placeholder.configure({placeholder: this.placeholder}),
    ]);
  } catch (error) {
    console.log("Tried to Parse: " + str);
    console.error(error);
    return '<span class="decode_error"><i class="far fa-exclamation-circle"></i> Error decoding content</span>';
  }
}

export default {
  data: function () {
    return {
      editor: null,
      colours: [
        "rgba(0,0,0)",
        "rgb(77,77,77)",
        "rgb(153,153,153)",
        "rgb(230,230,230)",
        "rgb(255,255,255)",
        "rgb(230,77,77)",
        "rgb(230,153,77)",
        "rgb(230,230,77)",
        "rgb(153,230,77)",
        "rgb(77,230,77)",
        "rgb(77,230,153)",
        "rgb(77,230,230)",
        "rgb(77,153,230)",
        "rgb(77,77,230)",
        "rgb(153,77,230)",
      ],
    };
  },
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Write something...",
    },
  },
  watch: {
    value(value) {
      const isSame = this.editor.getHTML() === value;

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(this.value, false);
    },
  },
  mounted() {
    window.addEventListener("click", this.onWindowClick);

    //     const Color = TextStyle.extend({
    //       defaultOptions: {
    //         types: ["textStyle"],
    //       },
    //
    //       addGlobalAttributes() {
    //         return [
    //           {
    //             types: this.options.types,
    //             attributes: {
    //               color: {
    //                 default: null,
    //                 renderHTML: (attributes) => {
    //                   if (!attributes.color) {
    //                     return {};
    //                   }
    //
    //                   return {
    //                     style: `color: ${attributes.color}`,
    //                   };
    //                 },
    //                 parseHTML: (element) => ({
    //                   color: element.style.color || null,
    //                 }),
    //               },
    //             },
    //           },
    //         ];
    //       },
    //
    //       addCommands() {
    //         return {
    //           setColor: (color) => ({ chain }) => {
    //             return chain().setMark("textStyle", { color: color }).run();
    //           },
    //           unsetColor: () => ({ chain }) => {
    //             return chain()
    //               .setMark("textStyle", { color: null })
    //               .removeEmptyTextStyle()
    //               .run();
    //           },
    //         };
    //       },
    //     });

    this.editor = new Editor({
      content: this.value,
      extensions: [
        Document,
        Paragraph,
        Text,
        Bold,
        Italic,
        Underline,
        Strike,
        Heading,
        TextStyle,
        FontFamily,
        Image,
        ListItem,
        BulletList,
        OrderedList,
        CodeBlock,
        Blockquote,
        HorizontalRule,
        History,
        Typography,
        Hardbreak,
        Color,
        Placeholder.configure({ placeholder: this.placeholder }),
      ],
      onUpdate: () => {
        this.$emit("input", this.editor.getHTML());
      },
    });
  },

  beforeDestroy() {
    this.editor.destroy();
    window.removeEventListener("click", this.onWindowClick);
  },
  methods: {
    onWindowClick(/*event*/) {
      let colourPickers = document.querySelectorAll(".colour-picker");

      for (const colourPicker of colourPickers) {
        // if(colourPicker.style.display != "none" && event.target.closest('.colour-picker') != colourPicker) {
        if (colourPicker.style.display != "none") {
          colourPicker.style.display = "none";
        }
      }
    },

    // this.hideAllDropdowns();
    //   }
    // },
    addImage() {
      fileDialog({ accept: "image/*" }).then(async (file) => {
        let formData = new FormData();
        formData.append("file", file[0]);
        const headers = { "Content-Type": "multipart/form-data" };

        api
          .post("/images/upload", formData, { headers: headers })
          .then((response) => {
            this.editor
              .chain()
              .focus()
              .setImage({ src: response.data.path })
              .run();
          })
          .catch((error) => {
            let message = "An unexpected error occured";

            if ("detail" in error.response) {
              message = error.response.detail;
            } else {
              switch (error.response.status) {
                case 403:
                  message = "You do not have permission to upload this file";
                  break;
              }
            }

            this.$buefy.toast.open({
              duration: 5000,
              message: message,
              type: "is-danger",
            });
          });
      });
    },
    showColorPicker(event) {
      let dropdown = event.currentTarget.querySelector(".colour-picker");

      window.setTimeout(function () {
        dropdown.style.display = "block";
        const dropdownRect = dropdown.getBoundingClientRect();
        const dropdownRightX = dropdownRect.x + dropdownRect.width;

        if (dropdownRightX > window.outerWidth) {
          dropdown.style.left = window.outerWidth - dropdownRightX - 16 + "px";
        }
      }, 200);
    },
  },
};
</script>

<style lang="scss">
.decode_error {
  border: 1px solid #f14668;
  border-radius: 0.2rem;
  background-color: #800000;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
}

.dropdown {
  position: relative;

  &.show {
    .dropdown-content {
      display: block;
    }
  }
}

.dropdown-content {
  // display: none;
  position: absolute;
  left: 0;
  background-color: #333;
  border: 1px solid #555;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.colour-picker {
  .row {
    max-width: 9.875rem;
  }

  .colour,
  .colour-remove {
    border: 0;
    background: transparent;
  }

  .colour {
    display: inline-block;
    margin: 1px !important;
    padding: 2px !important;
    line-height: 0;

    &:hover,
    &.is-active {
      border: 2px solid #ddd;
      border-radius: 4px;
      padding: 0 !important;
    }

    div {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 2px;
    }
  }

  .colour-remove {
    color: #ddd;
    display: block;
    text-align: center;
    margin-top: -0.5rem;
    margin-bottom: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;

    &:hover {
      color: #fff;
      background-color: #555;
    }
  }
}

.tiptap {
  .toolbar {
    border-width: 1px 1px 0 1px;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px 4px 0 0;

    button.toolbar-button {
      transition: all 0.1s;
      display: inline-block;
      font-family: Montserrat, Arial, Helvetica, sans-serif;
      line-height: 1.1rem;
      text-transform: uppercase;

      border: 0;
      background-image: none;
      background-color: transparent;
      color: #ddd;
      font-size: 0.8rem;
      transform: none;
      padding: 0.25rem 0.75rem;
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;

      &:hover,
      &.show {
        background-color: rgba(255, 255, 255, 0.05);
      }

      &.is-active {
        background-color: rgba(255, 255, 255, 0.2);
      }

      &:first-of-type {
        margin-left: 0.25rem;
      }

      &:last-of-type {
        margin-right: 0.25rem;
      }

      &.font-colour > i {
        color: #000;
        background-color: #eee;
        padding: 2px 4px;
        border-radius: 2px;
      }

      i {
        pointer-events: none;
      }
    }
  }

  .ProseMirror {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 1rem;
    font-size: 0.9rem;
    border-radius: 0 0 4px 4px;
    height: 20rem;
    max-height: 20rem;
    overflow: scroll;
    // color: #ced4da;
    color: rgba(255, 255, 255, 1);

    &:focus {
      outline: none;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: rgba(255, 255, 255, 0.3);
      pointer-events: none;
      height: 0;
    }

    /* Styling */
    > * + * {
      margin-top: 0.75em;
    }

    pre {
      display: block;
      white-space: pre-wrap;
      font-size: 0.8rem;
      padding: 0.75rem 1rem;
      border: 1px solid #333;
      border-radius: 4px;
      background-color: #333;
      color: #ff7b72;
    }

    // strong {
    //   color: #fff;
    // }

    //
    //     code {
    //       background-color: rgba(#616161, 0.1);
    //       color: #616161;
    //     }
  }
}
</style>
