//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.
import { $Values } from "utility-types";

import { GlobalVariables } from "@foxglove-studio/app/hooks/useGlobalVariables";
import { Topic, Message } from "@foxglove-studio/app/players/types";
import { RosDatatypes } from "@foxglove-studio/app/types/RosDatatypes";

// make sure to use import type to avoid bringing in the actual implementations to the bundle
import type { SourceFile, TypeChecker } from "typescript";

export const DiagnosticSeverity = {
  Hint: 1,
  Info: 2,
  Warning: 4,
  Error: 8,
};

export const Sources = {
  Typescript: "Typescript",
  DatatypeExtraction: "DatatypeExtraction",
  InputTopicsChecker: "InputTopicsChecker",
  OutputTopicChecker: "OutputTopicChecker",
  Runtime: "Runtime",
  Other: "Other",
};

export const ErrorCodes = {
  RUNTIME: 1,
  DatatypeExtraction: {
    NO_DEFAULT_EXPORT: 1,
    NON_FUNC_DEFAULT_EXPORT: 2,
    NO_TYPE_RETURN: 3,
    BAD_TYPE_RETURN: 4,
    UNKNOWN_ERROR: 5,
    NO_UNIONS: 6,
    NO_FUNCTIONS: 7,
    NO_CLASSES: 8,
    NO_TYPE_LITERALS: 9,
    NO_TUPLES: 10,
    NO_INTERSECTION_TYPES: 11,
    NO_TYPEOF: 12,
    PREFER_ARRAY_LITERALS: 13,
    STRICT_MARKERS_RETURN_TYPE: 14,
    LIMITED_UNIONS: 15,
    NO_NESTED_ANY: 16,
    NO_MAPPED_TYPES: 17,
  },
  InputTopicsChecker: {
    NO_TOPIC_AVAIL: 1,
    CIRCULAR_IMPORT: 2,
    NO_INPUTS_EXPORT: 3,
    EMPTY_INPUTS_EXPORT: 4,
    BAD_INPUTS_TYPE: 5,
  },
  OutputTopicChecker: {
    NO_OUTPUTS: 1,
    BAD_PREFIX: 2,
    NOT_UNIQUE: 3,
  },
  Other: {
    FILENAME: 1,
  },
};

export type Diagnostic = {
  severity: $Values<typeof DiagnosticSeverity>;
  message: string;
  source: $Values<typeof Sources>;
  startLineNumber?: number;
  startColumn?: number;
  endLineNumber?: number;
  endColumn?: number;
  code: number;
};

export type NodeData = {
  name: string;
  sourceCode: string;
  transpiledCode: string;
  projectCode: Map<string, string> | null | undefined;
  diagnostics: ReadonlyArray<Diagnostic>;
  inputTopics: ReadonlyArray<string>;
  outputTopic: string;
  outputDatatype: string;
  datatypes: RosDatatypes;
  // Should be ts.SourceFile and ts.TypeChecker. Not strongly typing here since we want to keep
  // Typescript out of the main bundle.
  sourceFile: SourceFile | null | undefined;
  typeChecker: TypeChecker | null | undefined;
  rosLib: string;
  // An array of globalVariable names
  globalVariables: ReadonlyArray<string>;
};

export type NodeRegistration = {
  nodeId: string;
  nodeData: NodeData;
  inputs: ReadonlyArray<string>;
  output: Topic;
  processMessage: (arg0: Message, arg1: GlobalVariables) => Promise<Message | null | undefined>;
  terminate: () => void;
};

export type NodeDataTransformer = (nodeData: NodeData, topics: Topic[]) => NodeData;

export type UserNodeLog = {
  source: "registerNode" | "processMessage";
  value: any; // TODO: This should ideally share the type def of `log()` in `lib.js`
};

export type UserNodeDiagnostics = {
  [nodeId: string]: { diagnostics: Diagnostic[] };
};
export type UserNodeLogs = {
  [nodeId: string]: { logs: UserNodeLog[] };
};

export type RegistrationOutput = {
  error: null | string;
  userNodeLogs: UserNodeLog[];
  userNodeDiagnostics: Diagnostic[];
};

export type ProcessMessageOutput = {
  message: Record<string, unknown> | null | undefined;
  error: null | string;
  userNodeLogs: UserNodeLog[];
  userNodeDiagnostics: Diagnostic[];
};