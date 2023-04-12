const path = require("path")

module.exports = function(mod) {
	const library = mod.require.library
	const cmd = mod.command
	let located = 0
	let tp_ctr = 0

	mod.dispatch.addDefinition("C_REQUEST_REPUTATION_STORE_TELEPORT", 2, path.join(__dirname, "C_REQUEST_REPUTATION_STORE_TELEPORT.2.def"))
	mod.dispatch.addDefinition("C_START_SKILL", 7, path.join(__dirname, "C_START_SKILL.7.def"))
	mod.dispatch.addDefinition("C_USE_PREMIUM_SLOT", 1, path.join(__dirname, "C_USE_PREMIUM_SLOT.1.def"))

	mod.game.on("enter_game", () => {
		located = 0
	})

	mod.game.on("leave_game", () => {
		tp_ctr = 0
	})

	mod.hook("C_REQUEST_REPUTATION_STORE_TELEPORT", "raw", event => {
		tp_ctr++
	})

	mod.hook("C_PLAYER_LOCATION", "raw", event => {
		located++

		// not sure why unhook doesn't work so using this instead
		if (located > 2)
			return

		buff()
	})

	cmd.add(["t", "tofu"], {
		"home": () => {
			home()
		},
		"pos": () => {
			pos()
		},
		"buff": () => {
			buff()
		}
	})

	cmd.add("home", {
		"$none": () => {
			home()
		}
	})

	function home() {
		cmd.message("Teleporting to Highwatch!")
		mod.send("C_REQUEST_REPUTATION_STORE_TELEPORT", 2, {
			counter: tp_ctr,
			unk2: 0
		})
		tp_ctr++
	}

	function pos() {
		cmd.message("zone".concat(":", mod.game.me.zone))
		cmd.message("x".concat(":", library.player.loc.x))
		cmd.message("y".concat(":", library.player.loc.y))
		cmd.message("z".concat(":", library.player.loc.z))
	}

	function buff() {
		// Nostrum
		mod.send("C_USE_PREMIUM_SLOT", 1, {
			set: 333,
			slot: 3,
			type: 1,
			id: 207546
		})
		// Moon Lotus Aura
		mod.send("C_START_SKILL", 7, {
			skill: {
				reserved: 0,
				npc: false,
				type: 1,
				huntingZoneId: 0,
				id: 60401323
			},
			w: library.player.loc.w,
			loc: {
				x: library.player.loc.x,
				y: library.player.loc.y,
				z: library.player.loc.z,
			},
			dest: {
				x: 0,
				y: 0,
				z: 0,
			},
		})
	}
}