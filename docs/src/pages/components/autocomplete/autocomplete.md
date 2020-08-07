---
title: Autocomplete React component
components: TextField, Popper, Autocomplete
---

# Autocomplete

<p class="description">The autocomplete is a normal text input enhanced by a panel of suggested options.</p>

The widget is useful for setting the value of a single-line textbox in one of two types of scenarios:

1. The value for the textbox must be chosen from a predefined set of allowed values, e.g., a location field must contain a valid location name: [combo box](#combo-box).
2. The textbox may contain any arbitrary value, but it is advantageous to suggest possible values to the user, e.g., a search field may suggest similar or previous searches to save the user time: [free solo](#free-solo).

It's meant to be an improved version of the "react-select" and "downshift" packages.

## Combo box

The value must be chosen from a predefined set of allowed values.

{{"demo": "pages/components/autocomplete/ComboBox.js"}}
