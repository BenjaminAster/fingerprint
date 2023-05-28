
// / <reference types="better-typescript" />
/// <reference types="@webgpu/types" />
/// <reference path="../new-javascript/index.d.ts" />
/// <reference path="../better-ts/index.d.ts" />

// navigator.serviceWorker.register("./service-worker.js", { scope: "./" });

const $ = document.querySelector.bind(document);

const countTruthy = (/** @type {any[]} */ array) => array.reduce((num, val) => val ? ++num : num, 0);

const round = (/** @type {number} */ value, /** @type {number} */ precision = 0) => (
	Math.round(value * (10 ** precision)) / (10 ** precision)
);

const hasPermission = async (/** @type {Parameters<Permissions["query"]>[0]["name"]} */ name) => {
	try {
		return (await navigator.permissions?.query?.({ name }))?.state === "granted";
	} catch {
		return false;
	}
};

const yesNo = (/** @type {boolean} */ boolean) => (
	boolean == null ? undefined : (boolean ? "yes" : "no")
);

let browserEngine = $("#browser-engine").textContent = (() => {
	if (window.chrome || Intl.v8BreakIterator) return "Blink";
	if (window.CSSMozDocumentRule) return "Gecko";
	if (CSS.supports("-webkit-nbsp-mode: normal")) return "WebKit";
	return "unknown";
})();

let sharedInfo = {
	gpu: "",
	gpuVendor: "",
};

{
	(async () => {
		$("#user-agent-string").textContent = navigator.userAgent;
		{
			$("#browser").textContent = await (async () => {
				if (browserEngine === "Blink") {
					if (await navigator.brave?.isBrave?.()) return "Brave";
					if (!window.IdleDetector) return "Microsoft Edge";
					return "Google Chrome";
				} else if (browserEngine === "Gecko") {
					if (navigator.plugins.length === 0) return "Tor";
					if (
						window.innerWidth % 100 === 0 && window.innerHeight % 100 === 0
						&&
						!new Intl.DateTimeFormat().resolvedOptions().timeZone.includes("/")
						&&
						document.createElement("canvas").getContext("webgl").getParameter(WebGLRenderingContext.prototype.RENDERER) === "Mozilla"
					) {
						return "Tor or Mullvad Browser";
					}
					return "Firefox";
				} else if (browserEngine === "WebKit") {
					return "Safari / Epiphany";
				} else {
					return "unknown";
				}
			})();
		}

		{
			{
				const fragment = $("#client-hint-brands > template").content;
				for (const { brand, version } of navigator.userAgentData?.brands ?? []) {
					if (/^notabrand$/i.test(brand.replaceAll(/[^a-z]/ig, ""))) continue;
					const clone = fragment.cloneNode(true);
					clone.querySelector(".brand").textContent = brand;
					clone.querySelector(".version").textContent = version;
					$("#client-hint-brands").append(clone);
				}
			}

			$("#client-hint-platform").textContent = navigator.userAgentData?.platform;
			$("#client-hint-mobile").textContent = yesNo(navigator.userAgentData?.mobile);

			const highEntropyValues = await navigator.userAgentData?.getHighEntropyValues?.([
				"architecture",
				"bitness",
				"fullVersionList",
				"model",
				"platformVersion",
				"uaFullVersion",
				"wow64",
			]);

			{
				const fragment = $("#client-hint-full-version-list > template").content;
				for (const { brand, version } of highEntropyValues?.fullVersionList ?? []) {
					if (/^notabrand$/i.test(brand.replaceAll(/[^a-z]/ig, ""))) continue;
					const clone = fragment.cloneNode(true);
					clone.querySelector(".brand").textContent = brand;
					clone.querySelector(".version").textContent = version;
					$("#client-hint-full-version-list").append(clone);
				}
			}

			$("#client-hint-architecture").textContent = highEntropyValues?.architecture;
			$("#client-hint-bitness").textContent = highEntropyValues?.bitness;
			$("#client-hint-model").textContent = highEntropyValues?.model;
			$("#client-hint-platform-version").textContent = highEntropyValues?.platformVersion;
			$("#client-hint-ua-full-version").textContent = highEntropyValues?.uaFullVersion;
			$("#client-hint-wow64").textContent = yesNo(highEntropyValues?.wow64);
		}
	})();

	{
		const fragment = $("#plugins > template").content;

		for (const plugin of navigator.plugins) {
			const clone = fragment.cloneNode(true);
			clone.querySelector(".name").textContent = plugin.name;
			clone.querySelector(".file-name").textContent = plugin.filename;
			clone.querySelector(".description").textContent = plugin.description;

			$("#plugins").append(clone);
		}
	}

	{
		const fragment = $("#mime-types > template").content;

		for (const mimeType of navigator.mimeTypes) {
			const clone = fragment.cloneNode(true);
			clone.querySelector(".type").textContent = mimeType.type;
			clone.querySelector(".suffixes").textContent = mimeType.suffixes;
			clone.querySelector(".description").textContent = mimeType.description;
			$("#mime-types").append(clone);
		}
	}

	if (performance.memory) {
		const numberFormat = new Intl.NumberFormat("en-US", {});
		$("#js-heap-size-limit").textContent = `${numberFormat.format(performance.memory?.jsHeapSizeLimit)} bytes`;
		$("#total-js-heap-size").textContent = `${numberFormat.format(performance.memory?.totalJSHeapSize)} bytes`;
	}
}

{
	$("#platform").textContent = navigator.platform;
	$("#hardware-concurrency").textContent = navigator.hardwareConcurrency?.toString();
	$("#device-memory").textContent = navigator.deviceMemory && `${navigator.deviceMemory} GB`;

	{
		const canvas = document.createElement("canvas");
		const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
		const rendererInfo = gl?.getExtension?.("WEBGL_debug_renderer_info");
		let gpu = gl?.getParameter?.(rendererInfo?.UNMASKED_RENDERER_WEBGL);
		gpu ||= gl?.getParameter?.(gl?.RENDERER);
		let vendor = gl?.getParameter?.(rendererInfo?.UNMASKED_VENDOR_WEBGL);
		vendor ||= gl?.getParameter?.(gl?.VENDOR);
		$("#graphics-card").textContent = gpu;
		$("#graphics-card-vendor").textContent = vendor;
		sharedInfo.gpu = gpu;
		sharedInfo.gpuVendor = vendor;
	}

	{
		const array = new Uint16Array(1);
		array[0] = 1;
		$("#endianness").textContent = `${new Uint8Array(array.buffer)[0] ? "little" : "big"}-endian`;
	}

	(async () => {
		$("#bluetooth-availability").textContent = yesNo(await navigator.bluetooth?.getAvailability?.());
	})();

	(async () => {
		$("#immersive-vr-supported").textContent = yesNo(await navigator.xr?.isSessionSupported?.("immersive-vr"));
	})();

	(async () => {
		$("#immersive-ar-supported").textContent = yesNo(await navigator.xr?.isSessionSupported?.("immersive-ar"));
	})();

	{
		const update = async () => {
			let cameras = 0;
			let microphones = 0;
			let speakers = 0;
			for (const { kind } of (await navigator.mediaDevices?.enumerateDevices?.()) ?? []) {
				if (kind === "videoinput") cameras++;
				else if (kind === "audioinput") microphones++;
				else if (kind === "audiooutput") speakers++;
			}
			$("#cameras").textContent = cameras.toString();
			$("#microphones").textContent = microphones.toString();
			$("#speakers").textContent = speakers.toString();
		}
		update();
		navigator.mediaDevices?.addEventListener?.("devicechange", update);
	}

	(async () => {
		const adapter = await navigator.gpu?.requestAdapter?.();
		const info = await adapter?.requestAdapterInfo?.();
		$("#webgpu-architecture").textContent = info?.architecture?.toString();
		$("#webgpu-description").textContent = info?.description?.toString();
		$("#webgpu-device").textContent = info?.device?.toString();
		$("#webgpu-driver").textContent = info?.driver?.toString();
		$("#webgpu-vendor").textContent = info?.vendor?.toString();
	})();
}

{
	{
		const update = () => {
			$("#language").textContent = navigator.language;
			$("#languages").textContent = navigator.languages.join(", ");
		};
		update();
		window.addEventListener("languagechange", update)
	}

	{
		let /** @type {Intl.ResolvedDateTimeFormatOptions} */ dateTimeInfo;
		{
			const update = () => {
				dateTimeInfo = new Intl.DateTimeFormat().resolvedOptions();
				$("#time-zone").textContent = `${dateTimeInfo.timeZone} (${new Intl.DateTimeFormat("en-US", {
					fractionalSecondDigits: 1,
					timeZoneName: "long",
				}).format(new Date()).slice(2)})`;
				$("#date-time-locale").textContent = dateTimeInfo.locale;
				$("#calendar").textContent = dateTimeInfo.calendar;
			};
			update();
			window.addEventListener("timezonechange", () => setTimeout(update));
		}

		{
			const element = $("#date-time");
			const frame = () => {
				element.textContent = new Date().toLocaleString("en-US", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
					hour12: false,
					fractionalSecondDigits: 3,
				});
				window.requestAnimationFrame(frame);
			};
			window.requestAnimationFrame(frame);
		}
	}

	$("#do-not-track").textContent = yesNo(Boolean(+navigator.doNotTrack));
	$("#global-privacy-control").textContent = yesNo(navigator.globalPrivacyControl);
	$("#cookie-enabled").textContent = yesNo(navigator.cookieEnabled);

	(async () => {
		$("#incognito").textContent = yesNo(await (async () => {
			if (browserEngine === "Blink") {
				return (await navigator.storage?.estimate?.())?.quota < performance.memory?.jsHeapSizeLimit
			} else if (browserEngine === "WebKit") {
				const name = crypto.randomUUID?.() || Math.random().toString();
				try {
					const request = window.indexedDB?.open?.(name);

					return await new Promise((resolve) => {
						request?.addEventListener?.("upgradeneeded", () => {
							const response = request.result;

							try {
								response.createObjectStore("temp", { autoIncrement: true }).put(new Blob());
								resolve(false);
							} catch (error) {
								const message = error?.message || error?.toString?.() || error?.stack;
								resolve(/BlobURLs are not yet supported/.test(message));
							}

							response?.close();
							window.indexedDB?.deleteDatabase?.(name);
						});
					});
				} catch {
					return false;
				}
			} else if (browserEngine === "Gecko") {
				const name = crypto.randomUUID?.() || Math.random().toString();
				try {
					const request = window.indexedDB?.open?.(name);
					const isIncognito = await new Promise((resolve) => {
						request?.addEventListener?.("error", () => {
							resolve(/\bmutation\b/.test(request?.error?.message));
						});
						request?.addEventListener?.("success", () => {
							resolve(false);
						});
					});
					request?.result?.close?.();
					window.indexedDB?.deleteDatabase?.(name);
					return isIncognito;
				} catch {
					return false;
				}
			}

			return false;
		})());
	})();

	$("#desktop-site-enabled").textContent = yesNo(!/\bMobile\b/i.test(navigator.userAgent) && "onorientationchange" in window);

	{
		const mediaMatch = window.matchMedia?.("(prefers-color-scheme: dark)");
		const update = () => {
			$("#dark-theme").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(prefers-contrast: more)");
		const update = () => {
			$("#prefers-contrast").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(prefers-reduced-data: reduce)");
		const update = () => {
			$("#prefers-reduced-data").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(prefers-reduced-motion: reduce)");
		const update = () => {
			$("#prefers-reduced-motion").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(prefers-reduced-transparency: reduce)");
		const update = () => {
			$("#prefers-reduced-transparency").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(inverted-colors: inverted)");
		const update = () => {
			$("#inverted-colors").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(forced-colors: active)");
		const update = () => {
			$("#forced-colors").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	(async () => {
		if (!await navigator.brave?.isBrave?.()) return;

		if (/^[a-zA-Z0-9]{8}$/.test(sharedInfo.gpu) && /^[a-zA-Z0-9]{8}$/.test(sharedInfo.gpuVendor)) {
			$("#brave-fingerprinting-protection").textContent = "aggressive";
			return;
		}

		{
			const canvas = new OffscreenCanvas(4, 4);
			const context = canvas.getContext("2d", { alpha: false }, undefined);
			context.fillStyle = "white";
			context.fillRect(0, 0, canvas.width, canvas.height);
			const data = context.getImageData(0, 0, canvas.width, canvas.height).data;

			for (const pixel of data) {
				if (pixel !== 0xFF) {
					$("#brave-fingerprinting-protection").textContent = "standard";
					return;
				}
			}
		}

		$("#brave-fingerprinting-protection").textContent = "none";
	})();

	(async () => {
		const fragment = $("#keyboard-layout-map > template").content;
		for (const [code, key] of [...(await navigator.keyboard?.getLayoutMap?.() ?? [])]) {
			const clone = fragment.cloneNode(true);
			clone.querySelector(".code").textContent = code;
			clone.querySelector(".key").textContent = key;
			$("#keyboard-layout-map").append(clone);
		}
	})();

	{
		const fragment = $("#speech-synthesis-voices > template").content;
		const update = () => {
			document.querySelectorAll("#speech-synthesis-voices > li").forEach((element) => element.remove());
			for (const { name } of (window.speechSynthesis?.getVoices?.() ?? [])) {
				const clone = fragment.cloneNode(true);
				clone.querySelector("[itemprop=name]").textContent = name;
				$("#speech-synthesis-voices").append(clone);
			}
		}
		update();
		window.speechSynthesis?.addEventListener?.("voiceschanged", update);
	}
}

{

	{
		const mediaMatch = window.matchMedia?.("(dynamic-range: high)");
		const update = () => {
			$("#high-dynamic-range").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	$("#device-pixel-ratio").textContent = round(window.devicePixelRatio, 10).toString();

	{
		let prevTime = document.timeline.currentTime;
		const element = $("#frame-rate");

		const frame = (/** @type {number} */ time) => {
			element.textContent = (1000 / (time - prevTime)).toFixed(0);
			prevTime = time;
			window.requestAnimationFrame(frame);
		}

		window.requestAnimationFrame(frame);
	}

	$("#max-touch-points").textContent = navigator.maxTouchPoints?.toString();

	{
		const update = () => {
			$("#screen-color-depth").textContent = window.screen?.colorDepth?.toString();
			$("#screen-pixel-depth").textContent = window.screen?.pixelDepth?.toString();
			$("#screen-is-extended").textContent = yesNo(window.screen?.isExtended);
		};
		update();
		window.screen?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(display-mode: fullscreen)");
		const update = () => {
			$("#fullscreen-enabled").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatch = window.matchMedia?.("(update: slow)");
		const update = () => {
			$("#slow-display-update").textContent = yesNo(mediaMatch.matches);
		};
		update();
		mediaMatch?.addEventListener?.("change", update);
	}

	{
		const mediaMatches = /** @type {const} */ ([
			{
				match: window.matchMedia?.("(color-gamut: srgb)"),
				name: "sRGB",
			},
			{
				match: window.matchMedia?.("(color-gamut: p3)"),
				name: "P3",
			},
			{
				match: window.matchMedia?.("(color-gamut: rec2020)"),
				name: "ITU-R BT.2020-2 (Rec.2020)",
			},
		]);
		const update = ({ matches = true } = {}) => {
			if (!matches) return;
			$("#color-gamut").textContent = mediaMatches.find(({ match: { matches } }) => matches)?.name;
		};
		update();
		for (const { match } of mediaMatches) {
			match?.addEventListener?.("change", update);
		}
	}

	{
		const update = () => {
			$("#screen-orientation").textContent = window.screen?.orientation?.type;
		};
		update();
		window.screen?.orientation?.addEventListener?.("change", update);
	}

	{
		const update = () => {
			$("#screen-available-width").textContent = window.screen?.availWidth?.toString();
			$("#screen-available-height").textContent = window.screen?.availHeight?.toString();
			$("#screen-available-left").textContent = window.screen?.availLeft?.toString();
			$("#screen-available-top").textContent = window.screen?.availTop?.toString();
			$("#screen-width").textContent = window.screen?.width?.toString();
			$("#screen-height").textContent = window.screen?.height?.toString();
		};
		update();
		window.screen?.addEventListener?.("change", update);
	}

	{
		const update = () => {
			$("#inner-width").textContent = window.innerWidth?.toString();
			$("#inner-height").textContent = window.innerHeight?.toString();
			$("#outer-width").textContent = window.outerWidth?.toString();
			$("#outer-height").textContent = window.outerHeight?.toString();
		};
		update();
		window.addEventListener("resize", update);
	}

	{
		let prevScreenX = window.screenX;
		let prevScreenY = window.screenY;
		const update = () => {
			if (window.screenX !== prevScreenX) {
				$("#screen-x").textContent = window.screenX?.toString();
				prevScreenX = window.screenX;
			}
			if (window.screenY !== prevScreenY) {
				$("#screen-y").textContent = window.screenY?.toString();
				prevScreenY = window.screenY;
			}
			requestAnimationFrame(update);
		};
		requestAnimationFrame(update);
	}

	{
		const update = () => {
			$("#visual-viewport-width").textContent = window.visualViewport?.width?.toString();
			$("#visual-viewport-height").textContent = window.visualViewport?.height?.toString();
			$("#visual-viewport-offset-left").textContent = window.visualViewport?.offsetLeft?.toString();
			$("#visual-viewport-offset-top").textContent = window.visualViewport?.offsetTop?.toString();
			$("#visual-viewport-scale").textContent = window.visualViewport?.scale?.toString();
		};
		update();
		window.visualViewport?.addEventListener?.("resize", update);
		window.visualViewport?.addEventListener?.("scroll", update);
	}
}

{
	$("#document-referrer").textContent = document.referrer;

	$("#history-length").textContent = history.length?.toString();

	$("#navigation-type").textContent = performance.getEntriesByType?.("navigation")?.[0]?.type;
}

{
	{
		const update = () => {
			$("#online").textContent = yesNo(navigator.onLine);
		};
		update();
		window.addEventListener("online", update);
		window.addEventListener("offline", update);
	}

	{
		(async () => {
			$("#ipv4-address").textContent = (await (await window.fetch("https://ipv4.seeip.org/jsonip"))?.json())?.ip;
		})();

		(async () => {
			$("#ipv6-address").textContent = (await (await window.fetch("https://ipv6.seeip.org/jsonip"))?.json())?.ip;
		})();

		(async () => {
			const info = await (await window.fetch("https://ipwho.is/"))?.json();
			$("#ip-country").textContent = info?.country;
			$("#ip-region").textContent = info?.region;
			$("#ip-postal-code-and-city").textContent = `${info?.postal} ${info?.city}`;
			$("#ip-latitude").textContent = info?.latitude?.toString();
			$("#ip-longitude").textContent = info?.longitude?.toString();
			$("#ip-isp").textContent = info?.connection?.isp;
		})();
	}

	{
		const update = () => {
			$("#network-connection-type").textContent = navigator.connection?.type;
			$("#network-effective-type").textContent = navigator.connection?.effectiveType?.toUpperCase();
			$("#network-downlink").textContent = `${navigator.connection?.downlink?.toString()} Mbit/s`;
			$("#network-downlink-max").textContent = `${navigator.connection?.downlinkMax} Mbit/s`;
			$("#network-rtt").textContent = `${navigator.connection?.rtt} milliseconds`;

			$("#save-data").textContent = yesNo(navigator.connection?.saveData);
		};
		navigator.connection && update();
		navigator.connection?.addEventListener?.("change", update);
	}
}

{
	(async () => {
		const battery = await navigator.getBattery?.();
		if (!battery) return;

		{
			const update = () => {
				$("#battery-level").textContent = `${round(battery.level * 100, 5)}%`;
			};
			update();
			battery.addEventListener?.("levelchange", update);
		}

		{
			const update = () => {
				$("#charging").textContent = yesNo(battery.charging);
			};
			update();
			battery.addEventListener?.("chargingchange", update);
		}

		{
			const update = () => {
				const time = battery.chargingTime;
				if (!Number.isFinite(time)) return;
				$("#charging-time").textContent = `${time} seconds`;
			};
			update();
			battery.addEventListener?.("chargingtimechange", update);
		}

		{
			const update = () => {
				const time = battery.dischargingTime;
				if (!Number.isFinite(time)) return;
				$("#discharging-time").textContent = `${time} seconds`;
			};
			update();
			battery.addEventListener?.("dischargingtimechange", update);
		}
	})();

	(async () => {
		const numberFormat = new Intl.NumberFormat("en-US", {});
		const byteSizeNames = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB"];
		const update = async () => {
			const { quota } = (await navigator.storage?.estimate?.()) ?? {};
			if (!quota) return;
			const magnitude = Math.floor(Math.log2(quota) / 10);
			$("#storage-quota-estimate").textContent = `${numberFormat.format(quota)} bytes (${round(quota / (1024 ** magnitude), 2)} ${byteSizeNames[magnitude]})`;
		};
		update();
		navigator.storage?.addEventListener?.("quotachange", update);
	})();

	(async () => {
		if (!window.AmbientLightSensor) return;
		const sensor = new AmbientLightSensor({ frequency: 10 });
		const update = () => {
			$("#ambient-light").textContent = round(sensor?.illuminance, 5).toString();
		};
		sensor?.addEventListener?.("reading", update);
		sensor?.start?.();
		update();
	})();

	(async () => {
		if (!window.PressureObserver) return;
		const changeCallback = (/** @type {PressureRecord[]} */ changes) => {
			for (const change of changes) {
				if (change.source === "cpu") {
					$("#compute-pressure-cpu").textContent = change.state;
				} else if (change.source === "thermals") {
					$("#compute-pressure-thermal").textContent = change.state;
				}
			}
		};
		const observer = new PressureObserver(changeCallback, { sampleRate: 10 });
		for (const source of PressureObserver.supportedSources ?? ["cpu"]) {
			(async () => {
				try {
					await observer.observe(source);
				} catch (error) {
					console.debug(new Error(`PressureObserver couldn't observe ${source}`, { cause: error }));
				}
			})();
		}
	})();
}

{
	if (!hasPermission("gyroscope") && window.DeviceOrientationEvent?.requestPermission) {
		$("#orientation-sensor-permission").addEventListener("click", async () => {
			await window.DeviceOrientationEvent.requestPermission();
		});
	} else {
		$("#orientation-sensor-permission").hidden = true;
	}

	if (!hasPermission("accelerometer") && window.DeviceMotionEvent?.requestPermission) {
		$("#motion-sensor-permission").addEventListener("click", async () => {
			await window.DeviceMotionEvent.requestPermission();
		});
	} else {
		$("#motion-sensor-permission").hidden = true;
	}

	window.addEventListener("deviceorientationabsolute", (event) => {
		$("#absolute-device-orientation-alpha > dd").textContent = event.alpha?.toFixed(1);
		$("#absolute-device-orientation-alpha").style.setProperty("--value", event.alpha);
		$("#absolute-device-orientation-beta > dd").textContent = event.beta?.toFixed(1);
		$("#absolute-device-orientation-beta").style.setProperty("--value", event.beta);
		$("#absolute-device-orientation-gamma > dd").textContent = event.gamma?.toFixed(1);
		$("#absolute-device-orientation-gamma").style.setProperty("--value", event.gamma);
	});

	window.addEventListener("deviceorientation", (event) => {
		$("#device-orientation-alpha > dd").textContent = event.alpha?.toFixed(1);
		$("#device-orientation-alpha").style.setProperty("--value", event.alpha);
		$("#device-orientation-beta > dd").textContent = event.beta?.toFixed(1);
		$("#device-orientation-beta").style.setProperty("--value", event.beta);
		$("#device-orientation-gamma > dd").textContent = event.gamma?.toFixed(1);
		$("#device-orientation-gamma").style.setProperty("--value", event.gamma);
	});

	window.addEventListener("devicemotion", (event) => {
		$("#rotation-rate-alpha > dd").textContent = event.rotationRate?.alpha?.toFixed(1);
		$("#rotation-rate-alpha").style.setProperty("--value", event.rotationRate?.alpha);
		$("#rotation-rate-beta > dd").textContent = event.rotationRate?.beta?.toFixed(1);
		$("#rotation-rate-beta").style.setProperty("--value", event.rotationRate?.beta);
		$("#rotation-rate-gamma > dd").textContent = event.rotationRate?.gamma?.toFixed(1);
		$("#rotation-rate-gamma").style.setProperty("--value", event.rotationRate?.gamma);

		$("#acceleration-x > dd").textContent = event.acceleration?.x?.toFixed(1);
		$("#acceleration-x").style.setProperty("--value", event.acceleration?.x);
		$("#acceleration-y > dd").textContent = event.acceleration?.y?.toFixed(1);
		$("#acceleration-y").style.setProperty("--value", event.acceleration?.y);
		$("#acceleration-z > dd").textContent = event.acceleration?.z?.toFixed(1);
		$("#acceleration-z").style.setProperty("--value", event.acceleration?.z);

		$("#acceleration-including-gravity-x > dd").textContent = event.accelerationIncludingGravity?.x?.toFixed(1);
		$("#acceleration-including-gravity-x").style.setProperty("--value", event.accelerationIncludingGravity?.x);
		$("#acceleration-including-gravity-y > dd").textContent = event.accelerationIncludingGravity?.y?.toFixed(1);
		$("#acceleration-including-gravity-y").style.setProperty("--value", event.accelerationIncludingGravity?.y);
		$("#acceleration-including-gravity-z > dd").textContent = event.accelerationIncludingGravity?.z?.toFixed(1);
		$("#acceleration-including-gravity-z").style.setProperty("--value", event.accelerationIncludingGravity?.z);
	});
};

export { };

[
	"audio/3gpp",
	"audio/3gpp2",
	"audio/AMR-NB",
	"audio/AMR-WB",
	"audio/GSM",
	"audio/aac",
	"audio/basic",
	"audio/flac",
	"audio/midi",
	"audio/mpeg",
	'audio/mp4; codecs="mp4a.40.2"',
	'audio/mp4; codecs="ac-3"',
	'audio/mp4; codecs="ec-3"',
	'audio/ogg; codecs="flac"',
	'audio/ogg; codecs="vorbis"',
	'audio/ogg; codecs="opus"',
	'audio/wav; codecs="1"',
	'audio/webm; codecs="vorbis"',
	'audio/webm; codecs="opus"',
	"audio/x-aiff",
	"audio/x-mpegurl"
];

[
	'video/mp4; codecs="flac"',
	'video/mp4; codecs="H.264, mp3"',
	'video/mp4; codecs="H.264, aac"',
	'video/mpeg; codec="H.264"',
	'video/ogg; codecs="theora"',
	'video/ogg; codecs="opus"',
	'video/webm; codecs="vp9, opus"',
	'video/webm; codecs="vp8, vorbis"'
];
