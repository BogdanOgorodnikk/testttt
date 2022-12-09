const calculatedFirstBlock = document.querySelectorAll(".calculated-first-block")
const calculatedSecondBlock = document.querySelectorAll(".calculated-second-block")
const calculatedBlocks = document.querySelectorAll(".calculated-blocks")
const accordionBlocks = document.querySelectorAll(".accordion-block")
const accordionButtons = document.querySelectorAll(".accordion-button")

let isStartedCalculate = false
let firstBlockMaxValue = 1145.28
let secondBlockMaxValue = 52
let activeAccordionIndex = 0
let isActiveAccordion = false

const MOBILE_WIDTH = 768

function setActiveMenuItem(index) {
    const isMobileTemplate = window.innerWidth <= MOBILE_WIDTH
    const mobileActiveIndex = activeAccordionIndex + 3
    const mobileIndex = index +3

    if(!isActiveAccordion) {
        accordionBlocks[0].classList.remove('md:block')
    }


    if(isMobileTemplate && activeAccordionIndex === index) {
        const accordionBlockClasses = [...accordionBlocks[activeAccordionIndex].classList]

        const isHiddenBlock = !!accordionBlockClasses.find((item) => item === 'hidden')

        if(isHiddenBlock) {
            accordionButtons[mobileIndex].classList.add('is-active')
            accordionBlocks[index].classList.remove('hidden')
        } else {
            accordionButtons[mobileIndex].classList.remove('is-active')
            accordionBlocks[index].classList.add('hidden')
        }
    } else {
        accordionBlocks[activeAccordionIndex].classList.add('hidden')
        accordionButtons[activeAccordionIndex].classList.remove('is-active')
        accordionBlocks[index].classList.remove('hidden')
        accordionButtons[index].classList.add('is-active')


        accordionButtons[mobileActiveIndex].classList.remove('is-active')
        accordionButtons[mobileIndex].classList.add('is-active')
    }
}

function onClickChangeAccordionBlock(index, blockValues) {
    setActiveMenuItem(index)

    activeAccordionIndex = index

    firstBlockMaxValue = blockValues[0]
    secondBlockMaxValue = blockValues[1]

    isStartedCalculate = false

    isActiveAccordion = true

    calculateBlocks()
}

function calculateBlockValue(block, maxValue, attribute) {
    const [blockValue] = block.innerText.match(/(\d+)/)

    if(!Number(blockValue) && !isStartedCalculate) {
        const timeout = 40
        const addToValueNumber = Math.floor(maxValue / timeout)

        const interval = setInterval(() => {
            const [blockValue] = block.innerText.match(/(\d+)/)
            const newBlockValue = Number(blockValue) + addToValueNumber

            if(newBlockValue >= maxValue) {
                const [integer, rest] = String(maxValue).split('.')
                const restValue = rest ? `,${rest}` : ''

                block.innerHTML = `${integer}${restValue}${attribute}`

                return clearInterval(interval)
            }

            block.innerHTML = `${newBlockValue}${attribute}`
        }, timeout)
    }
}

function calculateBlocks() {
    const isMobileTemplate = window.innerWidth <= MOBILE_WIDTH
    const accordionBlockClasses = [...accordionBlocks[activeAccordionIndex].classList]
    const isHiddenBlock = !!accordionBlockClasses.find((item) => item === 'hidden')

    if(isMobileTemplate && isHiddenBlock) return


    const windowHeight = window.innerHeight
    const isShownCalculatedBlocks = calculatedBlocks[activeAccordionIndex].getBoundingClientRect().top - windowHeight <= 0

    if(isShownCalculatedBlocks) {
        calculateBlockValue(calculatedFirstBlock[activeAccordionIndex], firstBlockMaxValue, ' kWh')
        calculateBlockValue(calculatedSecondBlock[activeAccordionIndex], secondBlockMaxValue, '%')

        isStartedCalculate = true
    }
}

function onResizeChangeAccordionItemState() {
    const isMobileTemplate = window.innerWidth <= MOBILE_WIDTH
    const accordionBlockClasses = [...accordionBlocks[activeAccordionIndex].classList]
    const isHiddenBlock = !!accordionBlockClasses.find((item) => item === 'hidden')

    if(!isMobileTemplate && isHiddenBlock) {
        accordionBlocks[activeAccordionIndex].classList.remove('hidden')
    } else if(!isActiveAccordion && isMobileTemplate) {
        accordionBlocks[activeAccordionIndex].classList.add('hidden')
    }
}

addEventListener('scroll', calculateBlocks);
addEventListener('resize', onResizeChangeAccordionItemState);
