export default class FormatUtil {
    static formatVotingCodeString(votingCode: string) {
        // each section contains <blockLength> numbers which are separated by a <separator>
        // pattern: <blockLength><separator><blockLength>
        const blockLength = 4;
        const separator = " ";

        let outputString = "";

        let stringIndex = 0;
        while (stringIndex < votingCode.length - 1) {
            let endIndex = stringIndex + blockLength;
            outputString += `${votingCode.substring(stringIndex, endIndex)}${separator}`;
            stringIndex += blockLength;
        }
        return outputString.substring(0, outputString.length - separator.length);
    }
}
