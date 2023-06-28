import { useEffect, useRef, useState } from "react";
import "./styles.css";
import { TiTick } from "react-icons/ti";
import Grogu from "../samples/grogu.json";
import CheeseCake from "../samples/cheeseCake.json";
import Sonic from "../samples/sonic.json";
import NyanCat from "../samples/nyanCat.json";

export function Grid() {
  const arr = [];
  let flag = 0;
  let eraseFlag = 0;
  let drawFlag = 1;
  let pickflag = 0;
  const [sliderLabel, setSliderLabel] = useState(20);
  const [rangeVal, setRangeVal] = useState(20);
  const [pixelColor, setPixelColor] = useState("#00000000");
  const [alpha, setAlpha] = useState(1);
  document.documentElement.style.setProperty(`--pixelCount`, rangeVal);
  let gridCount = rangeVal * rangeVal;
  const [imgData] = useState([]);
  const checkbox = useRef(null);
  const [name, setName] = useState("MyDrawing");
  // const [dnFlag, setDnFlag] = useState(0);
  let copy;
  let j,
    k,
    ab = 0;

  const handleChange = (e) => {
    setSliderLabel(e.target.value);
  };

  const reloadCanvas = () => {
    setRangeVal(document.querySelector("#slider").value);
    for (let i = 0; i < gridCount; i++) {
      document.querySelector("#grid" + i).style.backgroundColor = "#00000000";
    }
  };

  const setEraseFlag = () => {
    drawFlag = 0;
    eraseFlag = 1;
  };

  const setDrawFlag = () => {
    drawFlag = 1;
    eraseFlag = 0;
  };

  const setPickflag = () => {
    drawFlag = 0;
    eraseFlag = 0;
    pickflag = 1;
  };

  const download = (path, filename) => {
    const anchor = document.createElement("a");
    anchor.href = path;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const imageSave = () => {
    if (imgData.length > rangeVal) {
      copy = imgData.slice(0, rangeVal).map((i) => i.slice(0, rangeVal));
    } else {
      copy = imgData;
    }
    const drawing = { myDrawing: copy };
    const dataJson = JSON.stringify(drawing);
    const blob = new Blob([dataJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    download(url, name + ".json");
    URL.revokeObjectURL(url);
  };

  function sampleLoad(fileName) {
    const file = fileName;
    const imgDt = file.myDrawing;
    setRangeVal(imgDt.length);
    setTimeout(() => {
      let k = 0;
      for (let i = 0; i < imgDt.length; i++) {
        for (let j = 0; j < imgDt.length; j++) {
          document.querySelector("#grid" + k).style.backgroundColor =
            imgDt[i][j];
          k++;
          imgData[i][j] = imgDt[i][j];
        }
      }
    }, 0);
    setSliderLabel(imgDt.length);
  }

  const imageLoad = async () => {
    const file = await document.getElementById("load-file").files[0];
    const dt = Promise.resolve(file.text());
    dt.then((value) => {
      let imgDt = JSON.parse(value).myDrawing;
      setRangeVal(imgDt.length);
      setTimeout(() => {
        let k = 0;
        for (let i = 0; i < imgDt.length; i++) {
          for (let j = 0; j < imgDt.length; j++) {
            document.querySelector("#grid" + k).style.backgroundColor =
              imgDt[i][j];
            k++;
            imgData[i][j] = imgDt[i][j];
          }
        }
      }, 1000);
    });
  };

  const updateColorAlpha = () => {
    const hexOpacity = Math.floor(alpha * 255).toString(16);
    const ogColor = pixelColor.substring(0, 7);
    setPixelColor(ogColor + hexOpacity);
    document.getElementById("color-picker").style.opacity = alpha;
  };

  const rgba2hex = (rgba) => {
    const klr = `#${rgba
      .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
      .slice(1)
      .map((n, i) =>
        (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
          .toString(16)
          .padStart(2, "0")
          .replace("NaN", "")
      )
      .join("")}`;
    setPixelColor(klr);
    document.querySelector("#color-picker").value = klr;
  };

  function colorLabel() {
    if (pixelColor == "#00000000") {
      return "Please Select A Color ! ";
    } else {
      return "Doodle !";
    }
  }

  // function dwnld(cvs){
  //     cvs.toBlob(function (blob) {
  //     const url = URL.createObjectURL(blob);
  //     download(url, "MyDrawing.png");
  //     URL.revokeObjectURL(url);
  //   });
  // }

  function downloadImage(imb) {
    // console.log(imb);
    let upscale = 1;
    let chkbx = checkbox.current?.checked;
    if (chkbx) {
      document.getElementById("checkbox").checked = false;
      if (rangeVal < 45) {
        upscale = 4;
      } else {
        upscale = 2;
      }
    }
    console.log(upscale);
    let cpy = [];
    if (upscale == 4) {
      for (let j = 0; j < rangeVal; j++) {
        if (cpy[j * 4] == undefined) {
          cpy[j * 4] = [];
        }
        if (cpy[j * 4 + 1] == undefined) {
          cpy[j * 4 + 1] = [];
        }
        if (cpy[j * 4 + 2] == undefined) {
          cpy[j * 4 + 2] = [];
        }
        if (cpy[j * 4 + 3] == undefined) {
          cpy[j * 4 + 3] = [];
        }
        for (let k = 0; k < rangeVal; k++) {
          cpy[j * 4][k * 4] = imb[j][k];
          cpy[j * 4][k * 4 + 1] = imb[j][k];
          cpy[j * 4][k * 4 + 2] = imb[j][k];
          cpy[j * 4][k * 4 + 3] = imb[j][k];
          cpy[j * 4 + 1][k * 4] = imb[j][k];
          cpy[j * 4 + 1][k * 4 + 1] = imb[j][k];
          cpy[j * 4 + 1][k * 4 + 2] = imb[j][k];
          cpy[j * 4 + 1][k * 4 + 3] = imb[j][k];
          cpy[j * 4 + 2][k * 4] = imb[j][k];
          cpy[j * 4 + 2][k * 4 + 1] = imb[j][k];
          cpy[j * 4 + 2][k * 4 + 2] = imb[j][k];
          cpy[j * 4 + 2][k * 4 + 3] = imb[j][k];
          cpy[j * 4 + 3][k * 4] = imb[j][k];
          cpy[j * 4 + 3][k * 4 + 1] = imb[j][k];
          cpy[j * 4 + 3][k * 4 + 2] = imb[j][k];
          cpy[j * 4 + 3][k * 4 + 3] = imb[j][k];
        }
      }
    } else if (upscale == 2) {
      for (let j = 0; j < rangeVal; j++) {
        if (cpy[j] == undefined) {
          cpy[j] = [];
        }
        if (cpy[j * 2] == undefined) {
          cpy[j * 2] = [];
        }
        if (cpy[j * 2 + 1] == undefined) {
          cpy[j * 2 + 1] = [];
        }
        for (let k = 0; k < rangeVal; k++) {
          cpy[j * 2][k * 2] = imb[j][k];
          cpy[j * 2][k * 2 + 1] = imb[j][k];
          cpy[j * 2 + 1][k * 2] = imb[j][k];
          cpy[j * 2 + 1][k * 2 + 1] = imb[j][k];
        }
      }
    } else {
      cpy = undefined;
      cpy = imb;
      imb = undefined;
    }

    const concat = (xs, ys) => xs.concat(ys);

    const hexToRGBA = (cpy) => [
      parseInt(cpy.substr(1, 2), 16),
      parseInt(cpy.substr(3, 2), 16),
      parseInt(cpy.substr(5, 2), 16),
      parseInt(cpy.substr(7, 2), 16),
    ];

    const flattenedRGBAValues = cpy
      .reduce(concat)
      .map(hexToRGBA)
      .reduce(concat);

    const cvs = document.createElement("canvas");
    cvs.width = cvs.height = rangeVal * upscale;
    const ctx = cvs.getContext("2d");
    const imgData = ctx.createImageData(rangeVal * upscale, rangeVal * upscale);

    for (let i = 0; i < flattenedRGBAValues.length; i++) {
      imgData.data[i] = flattenedRGBAValues[i];
    }

    ctx.putImageData(imgData, 0, 0);

    cvs.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      download(url, name + ".png");
      URL.revokeObjectURL(url);
    });
  }

  async function dwnld() {
    const res = await downloadImage(imgData);
    res;
  }

  //   const myPromise = new Promise((myResolve) => {
  //     // console.log(imgData);
  //     if (dnFlag == 1) {
  //       setDnFlag(0);
  //       myResolve(downloadImage(imgData))
  //     }
  // });

  document.addEventListener("mousedown", () => {
    flag = 1;
  });
  document.addEventListener("mouseup", () => {
    flag = 0;
  });

  useEffect(() => {
    for (let i = 0; i < rangeVal; i++) {
      imgData[i] = [];
      for (let l = 0; l < rangeVal; l++) {
        imgData[i][l] = "#00000000";
      }
    }
  }, [rangeVal]);

  for (let i = 0; i < rangeVal; i++) {
    for (let l = 0; l < rangeVal; l++) {
      arr.push(ab);
      ab++;
    }
  }

  return (
    <>
      <h1 className="text-8xl py-4 text-center">Pixel Art</h1>
      <div className="grid grid-cols-[450px_25rem_450px] bg-base-300 p-5 mx-10 justify-between rounded-lg ring-2 overflow-hidden xl:grid-cols-[450px_50rem_450px]">
        <div className="grid grid-cols-[200px_200px] rounded-box place-items-center gap-4 p-4">
          <input
            type="text"
            placeholder="My Drawing"
            className="input input-bordered input-secondary col-span-2 w-full"
            id="name-text"
            onChange={() => {
              setName(document.getElementById("name-text").value);
            }}
          />
          <input
            id="color-picker"
            onChange={() => {
              const colorSelected =
                document.querySelector("#color-picker").value;
              setPixelColor(colorSelected + "ff");
              document.getElementById("color-picker").style.opacity = 1;
              setAlpha(1);
            }}
            type="color"
            // value={pixelColor}
          />
          <label className="text-error">{colorLabel()}</label>
          <div className="col-span-2 w-full">
            <div className="flex mb-2 justify-between">
              <label>Opacity</label>
              <label>{alpha * 100 + "%"}</label>
            </div>
            <input
              className="range range-sm range-accent"
              type="range"
              id="alpha"
              onClick={() => {
                setAlpha(document.getElementById("alpha").value);
                updateColorAlpha();
              }}
              onChange={() => {
                setAlpha(document.getElementById("alpha").value);
                updateColorAlpha();
              }}
              min="0"
              max="1"
              step="0.1"
              value={alpha}
            />
          </div>
          <div className="col-span-2 w-full">
            <div className="flex justify-between mb-2">
              <label>Canvas Size</label>
              <div className="flex gap-2">
                <label>{sliderLabel}</label>
                <button
                  className="bg-secondary rounded-full text-blue-700 hover:bg-green-500 p-1"
                  onClick={reloadCanvas}
                >
                  <TiTick />
                </button>
              </div>
            </div>
            <input
              className="range range-sm range-accent"
              id="slider"
              type="range"
              min="0"
              max="100"
              value={sliderLabel}
              onChange={handleChange}
            />
          </div>
          {/* <button
            type="button"
            className="btn btn-accent w-full"
            onClick={reloadCanvas}
          >
            Resize Canvas
          </button> */}
          <button
            type="button"
            className="btn btn-accent w-full"
            onClick={setDrawFlag}
          >
            Draw
          </button>
          <button
            type="button"
            className="btn btn-accent w-full"
            onClick={setEraseFlag}
          >
            Erase
          </button>
          <button
            type="button"
            className="btn btn-accent w-full"
            onClick={setPickflag}
          >
            Pick
          </button>
        </div>
        <div className="grid place-items-center">
          <div className="grid-container xl:w-[50rem] lg:w-[25rem] aspect-square">
            <div className="grid-row">
              {arr.map((item) => {
                return (
                  <div
                    className="grid-item"
                    id={"grid" + item}
                    key={item}
                    onClick={() => {
                      j = Math.floor(item / rangeVal);
                      k = item % rangeVal;
                      if (drawFlag) {
                        document.querySelector(
                          "#grid" + item
                        ).style.backgroundColor = pixelColor;
                        imgData[j][k] = pixelColor;
                      } else if (eraseFlag) {
                        document.querySelector(
                          "#grid" + item
                        ).style.backgroundColor = "#00000000";
                        imgData[j][k] = "#00000000";
                      } else if (pickflag) {
                        let clr = document.querySelector("#grid" + item).style
                          .backgroundColor;
                        rgba2hex(clr);
                        drawFlag = 1;
                        eraseFlag = 0;
                        pickflag = 0;
                      }
                    }}
                    onMouseMove={() => {
                      j = Math.floor(item / rangeVal);
                      k = item % rangeVal;
                      if (flag & drawFlag) {
                        document.querySelector(
                          "#grid" + item
                        ).style.backgroundColor = pixelColor;
                        imgData[j][k] = pixelColor;
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[200px_200px] rounded-box place-items-center gap-4 p-4">
          <input
            id="load-file"
            className="file-input file-input-bordered file-input-accent w-full col-span-2 "
            type="file"
          />
          <button
            type="button"
            className="btn btn-accent w-full"
            onClick={imageSave}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-accent w-full"
            onClick={imageLoad}
          >
            Load
          </button>
          {/* <div className="flex justify-between mb-2">
              <label>Samples</label>
            </div> */}
          <button
            className="btn btn-secondary w-full"
            type="button"
            onClick={() => {
              sampleLoad(NyanCat);
            }}
          >
            Nyan Cat
          </button>
          <button
            className="btn btn-secondary w-full"
            type="button"
            onClick={() => {
              sampleLoad(Sonic);
            }}
          >
            Sonic
          </button>
          <button
            className="btn btn-secondary w-full"
            type="button"
            onClick={() => {
              sampleLoad(CheeseCake);
            }}
          >
            Cheese Cake
          </button>
          <button
            className="btn btn-secondary w-full"
            type="button"
            onClick={() => {
              sampleLoad(Grogu);
            }}
          >
            Grogu
          </button>
          <input
            type="checkbox"
            className="toggle toggle-error"
            id="checkbox"
            ref={checkbox}
          />
          <label>upscale (Takes longer to download)</label>
          <button
            className="btn btn-accent w-full justify-center"
            type="button"
            id="download-button"
            // onClick={() => downloadImage(imgData)}
            onClick={() => dwnld()}
            // onClick={() => {
            //   setDnFlag(1);
            //   myPromise.then()}
            //   }
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
}
