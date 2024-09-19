// biome-ignore lint/style/noVar: <explanation>
var localLists = {
	getAll() {
		lists =
			localStorage
				.getItem("lists")
				.split(";")
				.map((l) => new ItemList().fromString(l)) ?? [];
		return lists;
	},
	get(name) {
		console.log(lists);
		return lists.find((list) => list.name === name);
	},
	set(lists) {
		localStorage.setItem("lists", lists.map((l) => l.toString()).join(";"));
	},
	save() {
		this.set(lists);
	},
	addList(name) {
		const newList = new ItemList(name);
		lists.push(newList);
		this.set(lists);
		return newList;
	},
	deleteList(name) {
		const index = lists.findIndex((list) => list.name === name);
		lists.splice(index, 1);
		this.set(lists);
	},
};

// lists.set(["Wocheneinkauf", "WG-Party"])

class ItemList extends Map {
	constructor(name, items) {
		super();
		this.name = name;
		this.id = 0;

		if (items) {
			for (const item of items) {
				this.addItem(item);
			}
		}
	}

	addItem(item) {
		this.id++;
		super.set(this.id, item);
		// this.saveAll()
	}

	setItem(item) {
		super.set(item.id, item);
	}

	saveAll() {
		localLists.set(lists);
	}

	removeItem(id) {
		super.delete(id);
	}

	getItem(id) {
		return super.get(id);
	}

	getItems() {
		const items = new Array();

		for (const id of [...super.keys()]) {
			items.push({ id, ...this.getItem(id) });
		}

		return items;
	}

	fromString(string) {
		const [_, name, itemsList] = string.match(/(.*){(.*)}/);
		const items =
			itemsList?.split("|")?.map((l) => {
				const [_, name, amount, checked] = l.match(/\('(.+)','(.+)','(.+)'\)/);
				return { name, amount: amount ?? 0, checked: checked === "1" ?? false };
			}) ?? [];
		return new ItemList(name, items);
	}

	toString() {
		return `${this.name}{${this.getItems()
			.map((i) => `('${i.name}','${i.amount}','${i.checked ? "1" : "0"}')`)
			.join("|")}}`;
	}
}

let lists = [];

function loadDefaultLists() {
	lists = [];
	const wocheneinkauf = new ItemList("Wocheneinkauf");
	wocheneinkauf.addItem({ name: "Tomaten", amount: 5, checked: false });
	wocheneinkauf.addItem({ name: "Mehl", amount: 5, checked: false });
	wocheneinkauf.addItem({ name: "Käse", amount: 5, checked: false });
	wocheneinkauf.addItem({ name: "Hefe", amount: 6, checked: false });
	lists.push(wocheneinkauf);

	const wg_party = new ItemList("WG-party");
	wg_party.addItem({ name: "Käse", amount: 10, checked: false });
	wg_party.addItem({ name: "Hefe", amount: 20, checked: false });
	lists.push(wg_party);

	localLists.set(lists);
}

const e = document.createElement("div");

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} type
 *
 * @template {{[key: string]: string}} createOptions
 *
 * @param {createOptions} options
 * @param {HTMLElement[]|undefined} childs
 * @returns {HTMLElementTagNameMap[K]}
 */
function createElement(type, options, childs) {
	const el = document.createElement(type);
	for (const key of Object.keys(options)) {
		el[key] = options[key];
	}

	for (const child of childs ?? []) {
		el.appendChild(child);
	}

	return el;
}

// if ("serviceWorker" in navigator) {
// 	navigator.serviceWorker.register("/sw.js");
// }
