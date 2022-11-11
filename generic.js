function $e(tag, parent, attributes) {
	// Small helper function for dynamic UI creation

	let element = document.createElement(tag);

	if (!attributes) attributes = {};

	if ("classes" in attributes) {
		if (!Array.isArray(attributes.classes)) throw Error("Classes was not array!");
		for (const className of attributes.classes) {
			element.classList.add(className);
		}
		delete attributes.classes;
	}


	for (const [attribute, value] of Object.entries(attributes)) {
		if (attribute.includes(".")) {
			let ref = element;
			const parts = attribute.split(".");

			for (const part of parts.slice(0, -1)) {
				ref = ref[part];
			}

			ref[parts[parts.length - 1]] = value;
			continue;
		}

		if (attribute in element) {
			element[attribute] = value;
		} else {
			element.setAttribute(attribute, value);
		}
	}

	parent.appendChild(element);
	return element;
}

function $el(selector) {
    return document.querySelector(selector);
}